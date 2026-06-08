import React, { useState, useRef, DragEvent } from 'react';
import { ChevronRight, ChevronDown, GripVertical, Plus, Trash2, Edit2 } from 'lucide-react';

// Types
interface MenuItem {
  id: string;
  label: string;
  url?: string;
  children?: MenuItem[];
  isExpanded?: boolean;
}

interface DragState {
  draggedItem: MenuItem | null;
  dragOverItem: MenuItem | null;
  dropPosition: 'above' | 'below' | 'inside' | null;
}

// Dummy data
const initialMenuItems: MenuItem[] = [
  {
    id: '1',
    label: 'Home',
    url: '/',
    isExpanded: false,
  },
  {
    id: '2',
    label: 'Products',
    url: '/products',
    isExpanded: true,
    children: [
      { id: '2-1', label: 'Electronics', url: '/products/electronics' },
      { id: '2-2', label: 'Clothing', url: '/products/clothing' },
      { id: '2-3', label: 'Books', url: '/products/books' },
    ],
  },
  {
    id: '3',
    label: 'Services',
    url: '/services',
    isExpanded: false,
    children: [
      { id: '3-1', label: 'Consulting', url: '/services/consulting' },
      { id: '3-2', label: 'Support', url: '/services/support' },
      {
        id: '3-3',
        label: 'Training',
        url: '/services/training',
        children: [
          { id: '3-3-1', label: 'Online Courses', url: '/services/training/online' },
          { id: '3-3-2', label: 'Workshops', url: '/services/training/workshops' },
        ],
      },
    ],
  },
  {
    id: '4',
    label: 'About',
    url: '/about',
    isExpanded: false,
    children: [
      { id: '4-1', label: 'Our Team', url: '/about/team' },
      { id: '4-2', label: 'History', url: '/about/history' },
    ],
  },
  {
    id: '5',
    label: 'Contact',
    url: '/contact',
  },
];

const DragDropNavigationMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [dragState, setDragState] = useState<DragState>({
    draggedItem: null,
    dragOverItem: null,
    dropPosition: null,
  });
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const dragCounter = useRef(0);

  // Helper function to find item by id
  const findItemById = (items: MenuItem[], id: string): MenuItem | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findItemById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper function to remove item by id
  const removeItemById = (items: MenuItem[], id: string): MenuItem[] => {
    return items
      .filter(item => item.id !== id)
      .map(item => ({
        ...item,
        children: item.children ? removeItemById(item.children, id) : undefined,
      }));
  };

  // Helper function to insert item at position
  const insertItemAtPosition = (
    items: MenuItem[],
    newItem: MenuItem,
    targetId: string,
    position: 'above' | 'below' | 'inside'
  ): MenuItem[] => {
    const result: MenuItem[] = [];
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.id === targetId) {
        if (position === 'above') {
          result.push(newItem, item);
        } else if (position === 'below') {
          result.push(item, newItem);
        } else if (position === 'inside') {
          result.push({
            ...item,
            children: [...(item.children || []), newItem],
            isExpanded: true,
          });
        }
      } else {
        const updatedItem = {
          ...item,
          children: item.children
            ? insertItemAtPosition(item.children, newItem, targetId, position)
            : item.children,
        };
        result.push(updatedItem);
      }
    }
    
    return result;
  };

  // Toggle expand/collapse
  const toggleExpanded = (id: string) => {
    const updateItems = (items: MenuItem[]): MenuItem[] =>
      items.map(item =>
        item.id === id
          ? { ...item, isExpanded: !item.isExpanded }
          : { ...item, children: item.children ? updateItems(item.children) : undefined }
      );
    
    setMenuItems(updateItems(menuItems));
  };

  // Start editing
  const startEditing = (item: MenuItem) => {
    setEditingItem(item.id);
    setEditValue(item.label);
  };

  // Save edit
  const saveEdit = () => {
    if (!editingItem || !editValue.trim()) return;

    const updateItems = (items: MenuItem[]): MenuItem[] =>
      items.map(item =>
        item.id === editingItem
          ? { ...item, label: editValue.trim() }
          : { ...item, children: item.children ? updateItems(item.children) : undefined }
      );

    setMenuItems(updateItems(menuItems));
    setEditingItem(null);
    setEditValue('');
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingItem(null);
    setEditValue('');
  };

  // Delete item
  const deleteItem = (id: string) => {
    setMenuItems(removeItemById(menuItems, id));
  };

  // Add new item
  const addNewItem = (parentId?: string) => {
    const newItem: MenuItem = {
      id: `new-${Date.now()}`,
      label: 'New Item',
      url: '/new-item',
    };

    if (parentId) {
      const updateItems = (items: MenuItem[]): MenuItem[] =>
        items.map(item =>
          item.id === parentId
            ? {
                ...item,
                children: [...(item.children || []), newItem],
                isExpanded: true,
              }
            : { ...item, children: item.children ? updateItems(item.children) : undefined }
        );
      setMenuItems(updateItems(menuItems));
    } else {
      setMenuItems([...menuItems, newItem]);
    }
  };

  // Drag handlers
  const handleDragStart = (e: DragEvent<HTMLDivElement>, item: MenuItem) => {
    setDragState({ ...dragState, draggedItem: item });
    e.dataTransfer.effectAllowed = 'move';
    dragCounter.current = 0;
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>, item: MenuItem) => {
    e.preventDefault();
    dragCounter.current++;
    
    if (dragState.draggedItem?.id === item.id) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;
    
    let position: 'above' | 'below' | 'inside' = 'below';
    
    if (y < height * 0.25) {
      position = 'above';
    } else if (y > height * 0.75) {
      position = 'below';
    } else {
      position = 'inside';
    }

    setDragState({
      ...dragState,
      dragOverItem: item,
      dropPosition: position,
    });
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragState({
        ...dragState,
        dragOverItem: null,
        dropPosition: null,
      });
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetItem: MenuItem) => {
    e.preventDefault();
    dragCounter.current = 0;

    const { draggedItem, dropPosition } = dragState;
    
    if (!draggedItem || !dropPosition || draggedItem.id === targetItem.id) {
      setDragState({ draggedItem: null, dragOverItem: null, dropPosition: null });
      return;
    }

    // Remove dragged item from its current position
    const itemsWithoutDragged = removeItemById(menuItems, draggedItem.id);
    
    // Insert at new position
    const updatedItems = insertItemAtPosition(
      itemsWithoutDragged,
      draggedItem,
      targetItem.id,
      dropPosition
    );

    setMenuItems(updatedItems);
    setDragState({ draggedItem: null, dragOverItem: null, dropPosition: null });
  };

  // Render menu item
  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = item.isExpanded && hasChildren;
    const isDraggedOver = dragState.dragOverItem?.id === item.id;
    const isBeingDragged = dragState.draggedItem?.id === item.id;

    return (
      <div key={item.id} className="select-none">
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, item)}
          onDragEnter={(e) => handleDragEnter(e, item)}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, item)}
          className={`
            relative flex items-center gap-2 p-2 border rounded-lg cursor-move transition-all duration-200
            ${isBeingDragged ? 'opacity-50 bg-blue-100' : 'bg-white hover:bg-gray-50'}
            ${isDraggedOver ? 'ring-2 ring-blue-500' : 'border-gray-200'}
            ${level > 0 ? 'ml-6' : ''}
          `}
          style={{ marginLeft: level * 24 }}
        >
          {/* Drop indicators */}
          {isDraggedOver && dragState.dropPosition === 'above' && (
            <div className="absolute -top-1 left-0 right-0 h-0.5 bg-blue-500 rounded" />
          )}
          {isDraggedOver && dragState.dropPosition === 'below' && (
            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 rounded" />
          )}
          {isDraggedOver && dragState.dropPosition === 'inside' && (
            <div className="absolute inset-0 bg-blue-100 border-2 border-blue-500 border-dashed rounded-lg" />
          )}

          {/* Drag handle */}
          <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />

          {/* Expand/collapse button */}
          <button
            onClick={() => toggleExpanded(item.id)}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded"
            disabled={!hasChildren}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              )
            ) : (
              <div className="w-4 h-4" />
            )}
          </button>

          {/* Label */}
          <div className="flex-grow">
            {editingItem === item.id ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit();
                  if (e.key === 'Escape') cancelEdit();
                }}
                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            ) : (
              <span className="text-gray-800 font-medium">{item.label}</span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => startEditing(item)}
              className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => addNewItem(item.id)}
              className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
              title="Add child"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteItem(item.id)}
              className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Children */}
        {item.isExpanded && (
          <div className="mt-2 space-y-2">
            {item.children.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Navigation Menu Editor</h2>
          <button
            onClick={() => addNewItem()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        <div className="space-y-3 group">
          {menuItems.map(item => renderMenuItem(item))}
        </div>

        {menuItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No menu items yet.</p>
            <p className="text-sm">Click "Add Item" to get started.</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">How to use:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• **Drag & Drop**: Click and drag items to reorder them</li>
          <li>• **Drop Zones**: Drop above, below, or inside other items</li>
          <li>• **Edit**: Click the edit icon to rename items</li>
          <li>• **Add Children**: Click the plus icon to add sub-items</li>
          <li>• **Expand/Collapse**: Click the arrow to show/hide children</li>
          <li>• **Delete**: Click the trash icon to remove items</li>
        </ul>
      </div>
    </div>
  );
};

export default DragDropNavigationMenu;