import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Trash2, MousePointer2, Pencil, Square, Circle, Minus, Type, Palette, Eraser, AlertCircle, Check, X, ArrowUpRight, ZoomIn, ZoomOut, Move, RotateCcw } from 'lucide-react';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#ffffff', '#000000'];
const TOOLS = [
    { id: 'pen', icon: Pencil, label: 'Pen' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'arrow', icon: ArrowUpRight, label: 'Arrow' },
    { id: 'line', icon: Minus, label: 'Line' },
    { id: 'rect', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'text', icon: Type, label: 'Text' }
];

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;
const ZOOM_SENSITIVITY = 0.001;

const CURSOR_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#a855f7', '#ec4899', '#14b8a6', '#f97316'];

const Whiteboard = ({ socket, eventId, isMaximized, currentUserId, initialHistory = [], canClear = false }) => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState('pen');
    const [color, setColor] = useState('#3b82f6');
    const [lineWidth, setLineWidth] = useState(3);
    const [isFilled, setIsFilled] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [textInput, setTextInput] = useState({ visible: false, x: 0, y: 0, content: '' });
    const [showClearModal, setShowClearModal] = useState(false);

    // Pan & Zoom state
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const [spaceHeld, setSpaceHeld] = useState(false);

    // Remote cursors: { [userId]: { x, y, name, color } }
    const [remoteCursors, setRemoteCursors] = useState({});
    const cursorTimeouts = useRef({});

    // Sync history state
    const [actions, setActions] = useState([]);

    useEffect(() => {
        if (initialHistory && initialHistory.length > 0) {
            setActions(initialHistory);
        }
    }, [initialHistory]);

    // Convert screen coords to world coords
    const screenToWorld = useCallback((screenX, screenY) => {
        return {
            x: (screenX - offset.x) / scale,
            y: (screenY - offset.y) / scale
        };
    }, [offset, scale]);

    // Convert world coords to screen coords (for text input positioning)
    const worldToScreen = useCallback((worldX, worldY) => {
        return {
            x: worldX * scale + offset.x,
            y: worldY * scale + offset.y
        };
    }, [offset, scale]);

    const renderAction = useCallback((ctx, action) => {
        const { type, data, color, width, filled } = action;
        
        ctx.save();
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (type === 'erase') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.moveTo(data.x0, data.y0);
            ctx.lineTo(data.x1, data.y1);
            ctx.stroke();
        } else {
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.globalCompositeOperation = 'source-over';

            switch (type) {
                case 'pen':
                case 'line':
                    ctx.beginPath();
                    ctx.moveTo(data.x0, data.y0);
                    ctx.lineTo(data.x1, data.y1);
                    ctx.stroke();
                    break;
                case 'arrow':
                    drawArrow(ctx, data.x0, data.y0, data.x1, data.y1, width);
                    break;
                case 'rect':
                    ctx.beginPath();
                    ctx.rect(data.x, data.y, data.width, data.height);
                    if (filled) ctx.fill();
                    ctx.stroke();
                    break;
                case 'circle':
                    ctx.beginPath();
                    ctx.arc(data.x, data.y, data.radius, 0, 2 * Math.PI);
                    if (filled) ctx.fill();
                    ctx.stroke();
                    break;
                case 'text':
                    ctx.font = `bold ${width * 10}px Inter, sans-serif`;
                    ctx.textBaseline = 'top';
                    ctx.fillText(data.content, data.x, data.y);
                    break;
                default:
                    break;
            }
        }
        ctx.restore();
    }, []);

    const drawArrow = (ctx, x0, y0, x1, y1, width) => {
        const headlen = 10 + width;
        const angle = Math.atan2(y1 - y0, x1 - x0);
        
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 - headlen * Math.cos(angle - Math.PI / 6), y1 - headlen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 - headlen * Math.cos(angle + Math.PI / 6), y1 - headlen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
    };

    const redrawAll = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        if (!canvas || !ctx) return;

        // Reset transform and clear
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const dpr = window.devicePixelRatio || 1;

        // Apply pan & zoom transform (with device pixel ratio)
        ctx.setTransform(
            scale * dpr, 0, 0,
            scale * dpr,
            offset.x * dpr,
            offset.y * dpr
        );

        actions.forEach(action => renderAction(ctx, action));
    }, [actions, offset, scale, renderAction]);

    // Handle Resize
    useEffect(() => {
        const canvas = canvasRef.current;
        const parent = canvas.parentElement;
        if (!parent || !canvas) return;
        
        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = parent.offsetWidth * dpr;
            canvas.height = parent.offsetHeight * dpr;
            canvas.style.width = `${parent.offsetWidth}px`;
            canvas.style.height = `${parent.offsetHeight}px`;
            
            const context = canvas.getContext('2d');
            contextRef.current = context;
            redrawAll();
        };

        resize();
        const timer = setTimeout(resize, 100);
        
        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
            clearTimeout(timer);
        };
    }, [isMaximized, redrawAll]);

    // Redraw when actions/offset/scale change
    useEffect(() => {
        redrawAll();
    }, [redrawAll]);

    const emitAction = (action) => {
        if (socket) {
            socket.emit('whiteboard_draw', { ...action, eventId });
        }
        setActions(prev => [...prev, action]);
    };

    useEffect(() => {
        if (!socket) return;

        const handleRemoteDraw = (data) => {
            if (data.eventId === eventId) {
                setActions(prev => {
                    if (prev.find(a => JSON.stringify(a.data) === JSON.stringify(data.data) && a.type === data.type)) return prev;
                    return [...prev, data];
                });
            }
        };

        const handleRemoteClear = (data) => {
            if (data.eventId === eventId) {
                setActions([]);
            }
        };

        // Sync viewport from other users
        const handleRemoteViewport = (data) => {
            setOffset(data.offset);
            setScale(data.scale);
        };

        // Remote cursor tracking
        const handleRemoteCursor = (data) => {
            const userId = data.userId;
            setRemoteCursors(prev => ({
                ...prev,
                [userId]: { x: data.x, y: data.y, name: data.name, color: data.color }
            }));
            // Auto-hide cursor after 3 seconds of inactivity
            if (cursorTimeouts.current[userId]) clearTimeout(cursorTimeouts.current[userId]);
            cursorTimeouts.current[userId] = setTimeout(() => {
                setRemoteCursors(prev => {
                    const next = { ...prev };
                    delete next[userId];
                    return next;
                });
            }, 3000);
        };

        socket.on('whiteboard_draw', handleRemoteDraw);
        socket.on('whiteboard_clear', handleRemoteClear);
        socket.on('whiteboard_viewport', handleRemoteViewport);
        socket.on('whiteboard_cursor', handleRemoteCursor);

        return () => {
            socket.off('whiteboard_draw', handleRemoteDraw);
            socket.off('whiteboard_clear', handleRemoteClear);
            socket.off('whiteboard_viewport', handleRemoteViewport);
            socket.off('whiteboard_cursor', handleRemoteCursor);
        };
    }, [socket, eventId]);

    // Keyboard handling for Space-to-pan
    useEffect(() => {
        if (!isMaximized) return;
        const handleKeyDown = (e) => {
            if (e.code === 'Space' && !e.repeat) {
                // Don't prevent default if user is typing in an input or textarea
                const tagName = e.target.tagName.toLowerCase();
                if (tagName === 'input' || tagName === 'textarea' || e.target.isContentEditable) {
                    return;
                }
                
                e.preventDefault();
                setSpaceHeld(true);
            }
        };
        const handleKeyUp = (e) => {
            if (e.code === 'Space') {
                setSpaceHeld(false);
                setIsPanning(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isMaximized]);

    const getCoords = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        return screenToWorld(screenX, screenY);
    };

    const getScreenCoords = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    // Emit viewport changes to other users
    const emitViewport = useCallback((newOffset, newScale) => {
        if (socket && eventId) {
            socket.emit('whiteboard_viewport', { eventId, offset: newOffset, scale: newScale });
        }
    }, [socket, eventId]);

    // Scroll = Pan, Ctrl+Scroll = Zoom
    const handleWheel = useCallback((e) => {
        e.preventDefault();

        if (e.ctrlKey || e.metaKey) {
            // Ctrl + scroll = Zoom
            const rect = canvasRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const delta = -e.deltaY * ZOOM_SENSITIVITY;
            const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scale * (1 + delta)));
            const ratio = newScale / scale;

            const newOffset = {
                x: mouseX - ratio * (mouseX - offset.x),
                y: mouseY - ratio * (mouseY - offset.y)
            };
            setOffset(newOffset);
            setScale(newScale);
            emitViewport(newOffset, newScale);
        } else {
            // Regular scroll = Pan
            const newOffset = {
                x: offset.x - e.deltaX,
                y: offset.y - e.deltaY
            };
            setOffset(newOffset);
            emitViewport(newOffset, scale);
        }
    }, [scale, offset, emitViewport]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !isMaximized) return;
        canvas.addEventListener('wheel', handleWheel, { passive: false });
        return () => canvas.removeEventListener('wheel', handleWheel);
    }, [handleWheel, isMaximized]);

    const startDrawing = (e) => {
        // Middle mouse button = pan
        if (e.button === 1) {
            e.preventDefault();
            setIsPanning(true);
            setPanStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
            return;
        }

        // Space held = pan mode
        if (spaceHeld) {
            setIsPanning(true);
            setPanStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
            return;
        }

        const { x, y } = getCoords(e);
        if (tool === 'text') {
            const screen = getScreenCoords(e);
            setTextInput({ visible: true, x: screen.x, y: screen.y, worldX: x, worldY: y, content: '' });
            return;
        }
        setIsDrawing(true);
        setStartPos({ x, y });
    };

    // Emit local cursor position
    const emitCursor = useCallback((worldX, worldY) => {
        if (socket && eventId && currentUserId) {
            const colorIndex = currentUserId.charCodeAt(currentUserId.length - 1) % CURSOR_COLORS.length;
            socket.emit('whiteboard_cursor', {
                eventId,
                x: worldX,
                y: worldY,
                color: CURSOR_COLORS[colorIndex]
            });
        }
    }, [socket, eventId, currentUserId]);

    const draw = (e) => {
        // Always emit cursor position (world coords) when mouse moves on canvas
        if (isMaximized && !isPanning) {
            const worldCoords = getCoords(e);
            emitCursor(worldCoords.x, worldCoords.y);
        }

        if (isPanning) {
            setOffset({
                x: e.clientX - panStart.x,
                y: e.clientY - panStart.y
            });
            return;
        }

        if (!isDrawing) return;
        const { x, y } = getCoords(e);
        const ctx = contextRef.current;

        if (tool === 'pen' || tool === 'eraser') {
            const type = tool === 'eraser' ? 'erase' : 'pen';
            const action = {
                type,
                data: { x0: startPos.x, y0: startPos.y, x1: x, y1: y },
                color: tool === 'eraser' ? 'rgba(0,0,0,1)' : color,
                width: tool === 'eraser' ? lineWidth * 10 : lineWidth
            };
            emitAction(action);
            setStartPos({ x, y });
        } else {
            redrawAll();
            // Apply the transform for ghost rendering
            const dpr = window.devicePixelRatio || 1;
            ctx.setTransform(scale * dpr, 0, 0, scale * dpr, offset.x * dpr, offset.y * dpr);
            
            const ghostAction = {
                type: tool,
                data: tool === 'rect' ? { x: Math.min(x, startPos.x), y: Math.min(y, startPos.y), width: Math.abs(x - startPos.x), height: Math.abs(y - startPos.y) } :
                      tool === 'circle' ? { x: startPos.x, y: startPos.y, radius: Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2)) } :
                      { x0: startPos.x, y0: startPos.y, x1: x, y1: y },
                color,
                width: lineWidth,
                filled: isFilled
            };
            renderAction(ctx, ghostAction);
        }
    };

    const finishDrawing = (e) => {
        if (isPanning) {
            setIsPanning(false);
            return;
        }

        if (!isDrawing) return;
        setIsDrawing(false);

        if (tool !== 'pen' && tool !== 'eraser') {
            const { x, y } = getCoords(e);
            let actionData = {};
            
            if (tool === 'rect') {
                actionData = { x: Math.min(x, startPos.x), y: Math.min(y, startPos.y), width: Math.abs(x - startPos.x), height: Math.abs(y - startPos.y) };
            } else if (tool === 'circle') {
                actionData = { x: startPos.x, y: startPos.y, radius: Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2)) };
            } else if (tool === 'line' || tool === 'arrow') {
                actionData = { x0: startPos.x, y0: startPos.y, x1: x, y1: y };
            }

            emitAction({
                type: tool,
                data: actionData,
                color,
                width: lineWidth,
                filled: isFilled
            });
        }
    };

    const handleTextSubmit = (content) => {
        if (!content.trim()) return;
        
        emitAction({
            type: 'text',
            data: { x: textInput.worldX, y: textInput.worldY, content: content },
            color,
            width: lineWidth
        });
        setTextInput({ visible: false, x: 0, y: 0, worldX: 0, worldY: 0, content: '' });
    };

    const getCursorStyle = () => {
        if (isPanning || spaceHeld) return 'grab';
        if (tool === 'eraser') return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.9-9.9c1-1 2.5-1 3.4 0l4.3 4.3c1 1 1 2.5 0 3.4L10.4 21c-1 1-2.5 1-3.4 0Z'/%3E%3Cpath d='m19 15-7 7'/%3E%3C/svg%3E") 0 22, auto`;
        if (tool === 'text') return 'text';
        return 'crosshair';
    };

    const confirmClear = () => {
        setActions([]);
        if (socket) {
            socket.emit('whiteboard_clear', { eventId });
        }
        setShowClearModal(false);
    };

    const resetView = () => {
        const newOffset = { x: 0, y: 0 };
        setOffset(newOffset);
        setScale(1);
        if (socket && eventId) socket.emit('whiteboard_viewport', { eventId, offset: newOffset, scale: 1 });
    };

    const zoomIn = () => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const newScale = Math.min(MAX_ZOOM, scale * 1.3);
        const ratio = newScale / scale;
        const newOffset = {
            x: cx - ratio * (cx - offset.x),
            y: cy - ratio * (cy - offset.y)
        };
        setOffset(newOffset);
        setScale(newScale);
        if (socket && eventId) socket.emit('whiteboard_viewport', { eventId, offset: newOffset, scale: newScale });
    };

    const zoomOut = () => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const newScale = Math.max(MIN_ZOOM, scale / 1.3);
        const ratio = newScale / scale;
        const newOffset = {
            x: cx - ratio * (cx - offset.x),
            y: cy - ratio * (cy - offset.y)
        };
        setOffset(newOffset);
        setScale(newScale);
        if (socket && eventId) socket.emit('whiteboard_viewport', { eventId, offset: newOffset, scale: newScale });
    };

    return (
        <div className="relative w-full h-full bg-[#1C2738] rounded-2xl overflow-hidden border border-white/5 shadow-xl flex flex-col group/board">
            {/* Toolbar */}
            {isMaximized && (
                <div className="absolute top-4 left-4 bottom-20 flex flex-col gap-2 z-10 transition-opacity duration-300 overflow-y-auto no-scrollbar">
                    <div className="bg-[#111827]/90 backdrop-blur-md p-1.5 rounded-xl border border-white/10 flex flex-col gap-1 shadow-2xl shrink-0">
                        {TOOLS.map(t => (
                            <button
                                key={t.id}
                                onClick={() => {
                                    setTool(t.id);
                                    if (t.id === 'text') setTextInput({ visible: false, x: 0, y: 0, worldX: 0, worldY: 0, content: '' });
                                }}
                                className={`p-2 rounded-lg transition-all ${tool === t.id ? 'bg-accent-blue text-white shadow-lg scale-110' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                                title={t.label}
                            >
                                <t.icon size={18} />
                            </button>
                        ))}
                        <div className="h-px bg-white/10 my-1" />
                        <button
                            onClick={() => setIsFilled(!isFilled)}
                            className={`p-2 rounded-lg transition-all ${isFilled ? 'bg-accent-blue text-white shadow-lg scale-110' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                            title="Fill Shape"
                        >
                            <Palette size={18} />
                        </button>
                    </div>

                    <div className="bg-[#111827]/90 backdrop-blur-md p-1.5 rounded-xl border border-white/10 flex flex-col gap-2 shadow-2xl shrink-0">
                        {COLORS.map(c => (
                            <button
                                key={c}
                                onClick={() => setColor(c)}
                                className={`w-6 h-6 rounded-full border-2 transition-all ${color === c ? 'border-white scale-125 shadow-lg' : 'border-transparent hover:scale-110'}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Zoom Controls */}
            {isMaximized && (
                <div className="absolute bottom-4 left-4 flex items-center gap-1 z-10">
                    <div className="bg-[#111827]/90 backdrop-blur-md px-2 py-1.5 rounded-xl border border-white/10 flex items-center gap-1 shadow-2xl">
                        <button
                            onClick={zoomOut}
                            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
                            title="Zoom Out"
                        >
                            <ZoomOut size={16} />
                        </button>
                        <span className="text-[10px] font-black text-white/50 w-10 text-center select-none">
                            {Math.round(scale * 100)}%
                        </span>
                        <button
                            onClick={zoomIn}
                            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
                            title="Zoom In"
                        >
                            <ZoomIn size={16} />
                        </button>
                        <div className="w-px h-4 bg-white/10 mx-1" />
                        <button
                            onClick={resetView}
                            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
                            title="Reset View"
                        >
                            <RotateCcw size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* Clear Board Button - Restricted */}
            {canClear && isMaximized && (
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <button 
                        onClick={() => setShowClearModal(true)}
                        className="p-2 bg-[#111827]/80 backdrop-blur-md rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all border border-white/10 shadow-xl group/trash"
                        title="Clear Board"
                    >
                        <Trash2 size={18} className="group-hover/trash:scale-110 transition-transform" />
                    </button>
                </div>
            )}

            {/* Pan hint */}
            {isMaximized && (
                <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-[#111827]/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/5 pointer-events-none select-none">
                    <Move size={12} className="text-white/30" />
                    <span className="text-[9px] text-white/30 font-medium">Scroll to pan · Ctrl+Scroll to zoom</span>
                </div>
            )}

            <canvas
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                onMouseLeave={finishDrawing}
                ref={canvasRef}
                style={{ cursor: getCursorStyle() }}
                className="w-full h-full touch-none"
            />

            {textInput.visible && (
                <div 
                    className="absolute z-20 pointer-events-none"
                    style={{ left: textInput.x, top: textInput.y }}
                >
                    <input
                        autoFocus
                        className="bg-transparent text-white outline-none border-b border-accent-blue/50 font-bold px-1 pointer-events-auto"
                        style={{ color, fontSize: `${lineWidth * 10}px`, minWidth: '50px' }}
                        value={textInput.content}
                        onChange={(e) => setTextInput({ ...textInput, content: e.target.value })}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleTextSubmit(textInput.content);
                            if (e.key === 'Escape') setTextInput({ visible: false, x: 0, y: 0, worldX: 0, worldY: 0, content: '' });
                        }}
                        onBlur={() => handleTextSubmit(textInput.content)}
                        placeholder="Type..."
                    />
                </div>
            )}

            {/* Remote Cursors */}
            {isMaximized && Object.entries(remoteCursors).map(([userId, cursor]) => {
                // Convert world coords to screen coords for display
                const screenX = cursor.x * scale + offset.x;
                const screenY = cursor.y * scale + offset.y;
                return (
                    <div
                        key={userId}
                        className="absolute z-30 pointer-events-none transition-all duration-75 ease-linear"
                        style={{ left: screenX, top: screenY }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={cursor.color} className="drop-shadow-lg">
                            <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z" stroke="white" strokeWidth="1"/>
                        </svg>
                        <div
                            className="ml-4 -mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold text-white whitespace-nowrap shadow-lg"
                            style={{ backgroundColor: cursor.color }}
                        >
                            {cursor.name}
                        </div>
                    </div>
                );
            })}

            {!isMaximized && (
                <div className="absolute inset-0 bg-[#0A0F1A]/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none group-hover/board:bg-transparent transition-all">
                    <div className="bg-[#111827]/90 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 shadow-2xl">
                        <MousePointer2 size={14} className="text-accent-blue" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-white/80">Preview Only</span>
                    </div>
                </div>
            )}

            {/* Custom Confirmation Modal */}
            {showClearModal && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0F1A]/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#111827] border border-white/10 p-6 rounded-2xl shadow-2xl max-w-sm w-full scale-in-center animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-4 text-red-500">
                            <AlertCircle size={28} />
                            <h3 className="text-xl font-bold text-white">Clear Board?</h3>
                        </div>
                        <p className="text-white/60 mb-6 text-sm leading-relaxed">
                            This will permanently remove all drawing content for everyone in the session. This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={confirmClear}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
                            >
                                <Check size={18} />
                                Clear All
                            </button>
                            <button 
                                onClick={() => setShowClearModal(false)}
                                className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-xl font-bold transition-all border border-white/10 flex items-center justify-center gap-2"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Whiteboard;
