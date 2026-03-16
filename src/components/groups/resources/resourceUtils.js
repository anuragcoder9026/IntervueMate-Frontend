import {
    FileText,
    Video,
    Code,
    File,
} from 'lucide-react';

/**
 * Returns icon, color, bgColor, and displayType based on file extension.
 */
export const getFileMetaData = (fileType, fileName) => {
    const ext = fileType?.toLowerCase() || (fileName?.includes('.') ? fileName.split('.').pop().toLowerCase() : '');
    if (ext === 'txt') return { icon: FileText, color: 'text-amber-400', bgColor: 'bg-amber-400/10', displayType: 'TXT' };
    if (ext === 'md' || ext === 'markdown') return { icon: FileText, color: 'text-blue-400', bgColor: 'bg-blue-400/10', displayType: 'MD' };
    if (ext === 'pdf') return { icon: FileText, color: 'text-red-500', bgColor: 'bg-red-500/10', displayType: 'PDF' };
    if (['mp4', 'mov', 'avi', 'video'].includes(ext)) return { icon: Video, color: 'text-indigo-400', bgColor: 'bg-indigo-400/10', displayType: 'VIDEO' };
    if (['cpp', 'js', 'py', 'java', 'html', 'css', 'code'].includes(ext)) return { icon: Code, color: 'text-emerald-400', bgColor: 'bg-emerald-400/10', displayType: 'CODE' };
    if (['docx', 'doc'].includes(ext)) return { icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-500/10', displayType: 'DOCX' };
    if (['xlsx', 'xls', 'csv', 'sheet'].includes(ext)) return { icon: File, color: 'text-green-500', bgColor: 'bg-green-500/10', displayType: 'SHEET' };
    return { icon: File, color: 'text-slate-400', bgColor: 'bg-slate-500/10', displayType: ext.toUpperCase() || 'FILE' };
};

/**
 * Formats a date string to "DD Mon YYYY" format.
 */
export const formatDate = (dateString) => {
    if (!dateString) return '---';
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

/**
 * Returns the display name for a file.
 */
export const formatFileName = (file) => {
    return file?.name;
};

/**
 * Recursively finds the folder path in a tree to a target folder ID.
 * Returns an array of { id, name } objects representing the path.
 */
export const findFolderPath = (nodes, targetId, path = []) => {
    for (const node of nodes) {
        const currentPathArr = [...path, { id: node?.id, name: node?.name }];
        if (node?.id === targetId) return currentPathArr;
        if (node?.children) {
            const found = findFolderPath(node?.children, targetId, currentPathArr);
            if (found) return found;
        }
    }
    return null;
};

/**
 * Adds a new folder to the tree under a given parent.
 */
export const addFolderToTree = (nodes, parentId, newFolder) => {
    return nodes.map(node => {
        if (node?.id === parentId) {
            return { ...node, children: [...(node?.children || []), newFolder] };
        }
        if (node?.children) {
            return { ...node, children: addFolderToTree(node?.children, parentId, newFolder) };
        }
        return node;
    });
};

/**
 * Finds a folder node by ID in a tree.
 */
export const getFolderById = (nodes, id) => {
    for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
            const found = getFolderById(node.children, id);
            if (found) return found;
        }
    }
    return null;
};

/**
 * Collects all IDs recursively from a folder node (including itself).
 */
export const collectIdsRecursively = (node) => {
    let ids = [node.id];
    if (node.children) {
        for (const child of node.children) {
            ids = [...ids, ...collectIdsRecursively(child)];
        }
    }
    return ids;
};
