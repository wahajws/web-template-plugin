import React, { useState, useEffect, useRef, DragEvent  } from 'react';
import { List, ItemDragging } from 'devextreme-react/list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components/feedback/Loader';
import navigationMenuService from '@/services/navMenuService';
import { showSuccessToast, showErrorToast } from '@/utils/toast';
import { Settings, ArrowLeft, Save } from 'lucide-react';
import { ChevronRight, ChevronDown, Plus, Trash2, Edit2, ArrowUp, ArrowDown, Check, X } from 'lucide-react';

interface NavigationMenu {
  id: number;
  menuText: string;
  menuDescription: string;
  url: string;
  icon: string | null;
  parentId: number;
  orderIndex: number;
  children?: NavigationMenu[];
  isExpanded?: boolean;
  isChild?: boolean;
}

interface DragState {
  draggedItem: NavigationMenu | null;
  dragOverItem: NavigationMenu | null;
  dropPosition: 'above' | 'below' | 'inside' | null;
}

interface DragData {
  id: number;
  menuText: string;
  menuDescription: string;
  url: string;
  icon: string | null;
  parentId: number;
  orderIndex: number;
}

export const NavMenuConfigPage: React.FC = () => {
  const [allMenus, setAllMenus] = useState<NavigationMenu[]>([]);
  const [availableMenus, setAvailableMenus] = useState<NavigationMenu[]>([]);
  const [configuredMenus, setConfiguredMenus] = useState<NavigationMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // const [menuItems, setMenuItems] = useState<NavigationMenu[]>([]);
  const [dragState, setDragState] = useState<DragState>({
    draggedItem: null,
    dragOverItem: null,
    dropPosition: null,
  });
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const dragCounter = useRef(0);





  // Load all navigation menus
  useEffect(() => {
    loadMenus();
  }, []);

  // Helper function to update order indices for all items
  const updateOrderIndices = (menus: NavigationMenu[]): NavigationMenu[] => {
    return menus.map((menu, index) => ({
      ...menu,
      orderIndex: index,
      children: menu.children ? updateOrderIndices(menu.children) : undefined,
    }));
  };

  const markChildFlags = (
    menus: NavigationMenu[],
    parentId: number = 0
  ): NavigationMenu[] => {
    return menus.map(menu => ({
      ...menu,
      isChild: parentId !== 0,
      children: menu.children ? markChildFlags(menu.children, menu.id) : undefined,
    }));
  };

  const normalizeMenuTree = (menus: NavigationMenu[]): NavigationMenu[] =>
    markChildFlags(updateOrderIndices(menus));

  const buildHierarchicalStructure = (flatMenuItems: NavigationMenu[]): NavigationMenu[] => {
    const menuMap = new Map<number, NavigationMenu>();
    const rootItems: NavigationMenu[] = [];

    // First pass: Create all menu items with empty children arrays
    flatMenuItems.forEach(item => {
      menuMap.set(item.id, {
        ...item,
        children: []
      });
    });

    // Second pass: Build the hierarchy
    flatMenuItems.forEach(item => {
      const menuItem = menuMap.get(item.id)!;
      
      if (item.parentId === null || item.parentId === 0) {
        // Root level item
        rootItems.push(menuItem);
      } else {
        // Child item - add to parent's children array
        const parent = menuMap.get(item.parentId);
        if (parent) {
          parent.children!.push(menuItem);
        }
      }
    });

    // Sort items by sortIndex at each level
    const sortMenuItems = (items: NavigationMenu[]): NavigationMenu[] => {
      return items
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map(item => ({
          ...item,
          children: item.children ? sortMenuItems(item.children) : [],
        }));
    };

    return markChildFlags(sortMenuItems(rootItems));
  };


  const generateMenuDescription = (text: string): string =>
    text ? `${text} Menu` : '';

  const loadMenus = async () => {
    try {
      setLoading(true);
      const response = await navigationMenuService.getAll() as any;
      
      // Since httpService.get extracts response.data, response should be the data array directly
      let menuData = [];
      if (Array.isArray(response)) {
        // Direct array response (this is what we expect)
        menuData = response;
      } else if (response && response.success && response.data) {
        // Response with success wrapper (fallback)
        menuData = response.data;
      } else if (response && Array.isArray(response.data)) {
        // Response with data property (fallback)
        menuData = response.data;
      }
      
      if (menuData && menuData.length > 0) {
         const normalizedMenuData: NavigationMenu[] = menuData.map((item: any) => ({
          ...item,
          orderIndex: Number(item.orderIndex ?? 0),
          isChild: item.parentId !== null && item.parentId !== 0,
          children: item.children ? item.children : [],
          menuDescription: item.menuDescription || generateMenuDescription(item.menuText),
        }));

        console.log('Raw menu data:', menuData); // Debug log
        setAllMenus(normalizedMenuData);
        
        // Set all menus as available (both parent and child)
        setAvailableMenus(normalizedMenuData);
        
        // Initialize configured menus with hierarchical structure
        const hierarchicalMenus = buildHierarchicalStructure(normalizedMenuData);
        console.log('Hierarchical menus:', hierarchicalMenus); // Debug log
        
        // Filter out any invalid items
        const validMenus = hierarchicalMenus.filter(menu => 
          menu && menu.id && menu.menuText && typeof menu.id === 'number'
        );
        console.log('Valid menus after filtering:', validMenus); // Debug log
        
        // setMenuItems(validMenus);
        setConfiguredMenus(normalizeMenuTree(validMenus));
      } else {
        console.warn('No menu data received or empty array');
      }
    } catch (error) {
      showErrorToast('Failed to load navigation menus');
      console.error('Error loading menus:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDragStart = (e: any) => {
    console.log('Drag start event:', e); // Debug log
    console.log('From data:', e.fromData); // Debug log
    console.log('From index:', e.fromIndex); // Debug log
    
    if (e.fromData === 'availableMenus') {
      e.itemData = availableMenus[e.fromIndex];
    } else if (e.fromData === 'configuredMenus') {
      e.itemData = configuredMenus[e.fromIndex];
    }
    
    console.log('Item data set to:', e.itemData); // Debug log
  };

  const onAdd = (e: any) => {
    const draggedItem = e.itemData as DragData;
    
    // Validate that draggedItem has required properties
    if (!draggedItem || !draggedItem.id || !draggedItem.menuText) {
      console.error('Invalid dragged item:', draggedItem);
      return;
    }
    
    const targetIndex =
      typeof e.toIndex === 'number' && e.toIndex >= 0
        ? e.toIndex
        : configuredMenus.length;

    const newItem: NavigationMenu = {
      ...draggedItem,
      parentId: 0,
      orderIndex: 0,
      isChild: false,
      children: [],
      menuDescription: generateMenuDescription(draggedItem.menuText),
    };

    console.log('Adding new item:', newItem); // Debug log

    if (e.toData === 'configuredMenus') {
      setConfiguredMenus(prev => {
        const updated = [...prev];
        const boundedIndex = Math.min(Math.max(targetIndex, 0), updated.length);
        updated.splice(boundedIndex, 0, newItem);
        return normalizeMenuTree(updated);
      });
      setAvailableMenus(prev =>
        prev.filter(item => item.id !== newItem.id)
      );
    }
  };

  const onRemove = (e: any) => {
    if (e.fromData === 'configuredMenus') {
      setConfiguredMenus(prev =>
        normalizeMenuTree(prev.filter(item => item.id !== e.itemData.id))
      );
      const original = allMenus.find(item => item.id === e.itemData.id);
      if (original) {
        setAvailableMenus(prev =>
          normalizeMenuTree([...prev, original])
        );
      }
    }
  };

  const onReorder = (e: any) => {
    if (e.fromData === 'configuredMenus') {
      setConfiguredMenus(prev => {
        const updatedMenus = [...prev];
        const [movedItem] = updatedMenus.splice(e.fromIndex, 1);
        
        // Validate moved item
        if (!movedItem || !movedItem.id) {
          console.error('Invalid moved item:', movedItem);
          return prev;
        }
        
        updatedMenus.splice(e.toIndex, 0, movedItem);
        
        // Update order indices for all items (preserve parent-child relationships)
        return normalizeMenuTree(updatedMenus);
      });
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      console.log('All menus (original):', allMenus); // Debug log
      console.log('Configured menus (current):', configuredMenus); // Debug log
      
      // Create a mapping of current configured menus to their original data
      const updateData = configuredMenus
        .filter(menu => menu.id && menu.id > 0) // Only include items with valid IDs
        .map((menu, index) => {
          const originalMenu = allMenus.find(orig => orig.id === menu.id);
          if (!originalMenu) {
            console.warn('No original menu found for ID:', menu.id);
            return null;
          }
          
          const hasChanges = originalMenu.parentId !== menu.parentId || originalMenu.orderIndex !== index;
          
          if (hasChanges) {
            return {
              id: menu.id,
              parentId: menu.parentId,
              orderIndex: index
            };
          }
          return null;
        })
        .filter(update => update !== null);

      console.log('Update data:', updateData); // Debug log
      console.log('Payload to save:', {
        changes: updateData,
        configuredMenus,
        allMenus,
      });

      if (updateData.length === 0) {
        showSuccessToast('No changes to save');
        return;
      }

      const response = await navigationMenuService.bulkUpdate(updateData) as any;
      
      if (response.success) {
        showSuccessToast(`${response.data.length} menu items updated successfully`);
        // Reload menus to reflect changes
        await loadMenus();
      } else {
        showErrorToast('Failed to save menu configuration');
      }
    } catch (error) {
      showErrorToast('Failed to save menu configuration');
      console.error('Error saving menu config:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    // Reset to the original hierarchical structure
    const hierarchicalMenus = buildHierarchicalStructure(allMenus);
    setConfiguredMenus(normalizeMenuTree(hierarchicalMenus));
  };

  if (loading) {
    return <Loader />;
  }

/// NEW CODE STARTS HERE ///
  // Toggle expand/collapse
  const toggleExpanded = (id: number) => {

    console.log('Toggling expanded for id:', id); // Debug log

    const updateItems = (items: NavigationMenu[]): NavigationMenu[] =>
      items.map(item =>
        item.id === id
          ? { ...item, isExpanded: !item.isExpanded }
          : { ...item, children: item.children ? updateItems(item.children) : undefined }
      );
    
    setConfiguredMenus(prev => normalizeMenuTree(updateItems(prev)));
  };

    // Helper function to find item by id
  const findItemById = (items: NavigationMenu[], id: number): NavigationMenu | null => {
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
  const removeItemById = (items: NavigationMenu[], id: number): NavigationMenu[] => {
    return items
      .filter(item => item.id !== id)
      .map(item => ({
        ...item,
        children: item.children ? removeItemById(item.children, id) : undefined,
      }));
  };

  // Helper function to insert item at position
  const insertItemAtPosition = (
    items: NavigationMenu[],
    newItem: NavigationMenu,
    targetId: number,
    position: 'above' | 'below' | 'inside'
  ): NavigationMenu[] => {
    const result: NavigationMenu[] = [];
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.id === targetId) {
        const adjustedItem: NavigationMenu = {
          ...newItem,
          parentId: position === 'inside' ? item.id : item.parentId,
          isChild: position === 'inside' ? true : Boolean(item.parentId),
        };

        if (position === 'above') {
          result.push(adjustedItem, item);
        } else if (position === 'below') {
          result.push(item, adjustedItem);
        } else if (position === 'inside') {
          result.push({
            ...item,
            children: [...(item.children || []), { ...adjustedItem, parentId: item.id, isChild: true }],
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

  const moveItemInTree = (
    items: NavigationMenu[],
    targetId: number,
    direction: 'up' | 'down'
  ): { items: NavigationMenu[]; moved: boolean } => {
    const index = items.findIndex(item => item.id === targetId);
    if (index !== -1) {
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= items.length) {
        return { items, moved: false };
      }
      const newItems = [...items];
      const [movedItem] = newItems.splice(index, 1);
      newItems.splice(newIndex, 0, movedItem);
      return { items: newItems, moved: true };
    }

    let moved = false;
    const newItems = items.map(item => {
      if (!item.children || item.children.length === 0) {
        return item;
      }
      const result = moveItemInTree(item.children, targetId, direction);
      if (result.moved) {
        moved = true;
        return { ...item, children: result.items };
      }
      return item;
    });

    return { items: moved ? newItems : items, moved };
  };

  const moveItem = (itemId: number, direction: 'up' | 'down') => {
    setConfiguredMenus(prev => {
      const { items, moved } = moveItemInTree(prev, itemId, direction);
      return moved ? normalizeMenuTree(items) : prev;
    });
  };

  const getSiblingStatus = (
    items: NavigationMenu[],
    targetId: number
  ): { hasPrev: boolean; hasNext: boolean } | null => {
    const index = items.findIndex(item => item.id === targetId);
    if (index !== -1) {
      return {
        hasPrev: index > 0,
        hasNext: index < items.length - 1,
      };
    }

    for (const item of items) {
      if (item.children && item.children.length > 0) {
        const result = getSiblingStatus(item.children, targetId);
        if (result) {
          return result;
        }
      }
    }

    return null;
  };

  // Start editing
  const startEditing = (item: NavigationMenu) => {
    setEditingItem(item.id);
    setEditValue(item.menuText);
  };

  // Save edit
  const saveEdit = () => {
    if (!editingItem || !editValue.trim()) return;

    const trimmedText = editValue.trim();

    const updateItems = (items: NavigationMenu[]): NavigationMenu[] =>
      items.map(item =>
        item.id === editingItem
          ? {
              ...item,
              menuText: trimmedText,
              menuDescription: generateMenuDescription(trimmedText),
            }
          : { ...item, children: item.children ? updateItems(item.children) : undefined }
      );

    setConfiguredMenus(prev => normalizeMenuTree(updateItems(prev)));
    setAllMenus(prev =>
      prev.map(item =>
        item.id === editingItem
          ? {
              ...item,
              menuText: trimmedText,
              menuDescription: generateMenuDescription(trimmedText),
            }
          : item
      )
    );
    setAvailableMenus(prev =>
      prev.map(item =>
        item.id === editingItem
          ? {
              ...item,
              menuText: trimmedText,
              menuDescription: generateMenuDescription(trimmedText),
            }
          : item
      )
    );
    setEditingItem(null);
    setEditValue('');
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingItem(null);
    setEditValue('');
  };

    // Delete item
  const deleteItem = (id: number) => {
    setConfiguredMenus(prev => normalizeMenuTree(removeItemById(prev, id)));
  };

  // Add new item
  const addNewItem = (parentId?: number) => {
    const tempId = -Date.now();
    const newItem: NavigationMenu = {
      id: tempId,
      parentId: parentId || 0,
      menuText: 'New Item',
      menuDescription: generateMenuDescription('New Item'),
      icon: null, 
      orderIndex: 0,     
      url: '#',
      isChild: Boolean(parentId && parentId !== 0),
      children: [],
    };
    
    if (parentId) {
      const updateItems = (items: NavigationMenu[]): NavigationMenu[] =>
        items.map(item =>
          item.id === parentId
            ? {
                ...item,
                children: [newItem, ...(item.children || [])],
                isExpanded: true,
              }
            : { ...item, children: item.children ? updateItems(item.children) : undefined }
        );
      setConfiguredMenus(prev => normalizeMenuTree(updateItems(prev)));
    } else {
      setConfiguredMenus(prev => normalizeMenuTree([newItem, ...prev]));
    }
  };

  // Drag handlers
  const handleDragStart = (e: DragEvent<HTMLDivElement>, item: NavigationMenu) => {
    setDragState({ ...dragState, draggedItem: item });
    e.dataTransfer.effectAllowed = 'move';
    dragCounter.current = 0;
  };
  
    const handleDragEnter = (e: DragEvent<HTMLDivElement>, item: NavigationMenu) => {
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
  
    const handleDragLeave = (_e: DragEvent<HTMLDivElement>) => {
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
  
    const handleDrop = (e: DragEvent<HTMLDivElement>, targetItem: NavigationMenu) => {
      e.preventDefault();
      dragCounter.current = 0;
  
      const { draggedItem, dropPosition } = dragState;
      
      if (!draggedItem || !dropPosition || draggedItem.id === targetItem.id) {
        setDragState({ draggedItem: null, dragOverItem: null, dropPosition: null });
        return;
      }
  
      // Remove dragged item from its current position
      const itemsWithoutDragged = removeItemById(configuredMenus, draggedItem.id);
      
      // Insert at new position
      const updatedItems = insertItemAtPosition(
        itemsWithoutDragged,
        draggedItem,
        targetItem.id,
        dropPosition
      );
  
      setConfiguredMenus(normalizeMenuTree(updatedItems));
      setDragState({ draggedItem: null, dragOverItem: null, dropPosition: null });
    };



  // Render menu item
  const renderMenuItem = (itemData: NavigationMenu, level: number = 0) => {
    const hasChildren = itemData.children && itemData.children.length > 0;
    const isExpanded = itemData.isExpanded && hasChildren;
    const isDraggedOver = dragState.dragOverItem?.id === itemData.id;
    const isBeingDragged = dragState.draggedItem?.id === itemData.id;
    const siblingStatus = getSiblingStatus(configuredMenus, itemData.id) || { hasPrev: false, hasNext: false };
    const canMoveUp = siblingStatus.hasPrev;
    const canMoveDown = siblingStatus.hasNext;

    return (
      <div key={itemData.id} className="select-none">
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, itemData)}
          onDragEnter={(e) => handleDragEnter(e, itemData)}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, itemData)}
          className={`
            relative flex items-center gap-2 p-2 border rounded-lg cursor-move transition-all duration-200 mt-1 min-w-0
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

          {/* Expand/collapse button */}
          <button
            onClick={() => toggleExpanded(itemData.id)}
            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded"
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

           <div className={`flex-1 min-w-0 p-2 rounded cursor-move hover:bg-gray-50 ${itemData.parentId>0 ? 'bg-gray-50' : 'bg-white'}`}>
            <div className="flex justify-between items-start min-w-0">
              <div className="flex-1 min-w-0 space-y-1">
                {editingItem === itemData.id ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        saveEdit();
                      }
                      if (e.key === 'Escape') {
                        e.preventDefault();
                        cancelEdit();
                      }
                    }}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                ) : (
                  <div className="font-medium truncate">{itemData.menuText}</div>
                )}
                <div className="text-sm text-gray-500 truncate">
                  {editingItem === itemData.id
                    ? generateMenuDescription(editValue)
                    : itemData.menuDescription || generateMenuDescription(itemData.menuText) || 'No Description'}
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
              {editingItem === itemData.id ? (
                <>
                  <button
                    onClick={saveEdit}
                    className="p-1 hover:bg-gray-100 rounded text-green-600 hover:text-green-700 disabled:opacity-50"
                    title="Save"
                    disabled={!editValue.trim()}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => moveItem(itemData.id, 'up')}
                    className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    title="Move up"
                    disabled={!canMoveUp}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveItem(itemData.id, 'down')}
                    className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    title="Move down"
                    disabled={!canMoveDown}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => startEditing(itemData)}
                    className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-700"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => addNewItem(itemData.id)}
                    className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-700"
                    title="Add child"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteItem(itemData.id)}
                    className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
          </div>
        </div>

        {/* Children */}
        {isExpanded && itemData.children && (
          <div className="mt-2 space-y-2">
            {itemData.children.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderPreviewItems = (
    items: NavigationMenu[],
    level: number = 0
  ): React.ReactNode => {
    return items
      .slice()
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map(item => (
        <div
          key={item.id}
          className={level === 0 ? 'ml-0' : 'ml-6 mt-1'}
        >
          <div
            className={`flex items-center p-2 rounded-md ${
              level === 0 ? 'bg-muted' : 'bg-background border'
            }`}
          >
            <span className={level === 0 ? 'font-medium' : 'text-sm'}>
              {item.menuText}
            </span>
          </div>
          {item.children && item.children.length > 0 && (
            <div className="mt-1">
              {renderPreviewItems(item.children, level + 1)}
            </div>
          )}
        </div>
      ));
  };

/// NEW CODE ENDS HERE ///





  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nav Menu Config</h1>
          <p className="text-muted-foreground">
            Drag and drop menu items to configure navigation structure and order
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Drag and Drop Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Menus */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Available Menus
            </CardTitle>
            <CardDescription>
              Drag items from here to configure parent-child relationships
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <List
                dataSource={availableMenus}
                keyExpr="id"
                repaintChangesOnly={true}
                className="h-full"
                itemRender={(itemData: any) => (
                  <div className="p-2 border rounded cursor-move hover:bg-gray-50 bg-white">
                    <div className="font-medium">{itemData.menuText}</div>
                    <div className="text-sm text-gray-500">{itemData.menuDescription}</div>
                    <div className="text-xs text-gray-600">Available Menu</div>
                  </div>
                )}
              >
                <ItemDragging
                  allowReordering={true}
                  group="navMenus"
                  data="availableMenus"
                  onDragStart={onDragStart}
                  onAdd={onAdd}
                  onRemove={onRemove}
                  onReorder={onReorder}
                />
              </List>
            </div>
          </CardContent>
        </Card>

        {/* Configured Menus */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Configured Navigation
            </CardTitle>
            <CardDescription>
              Drag items to reorder and change parent-child relationships
              <div className='mt-2'>
                <Button  onClick={() => addNewItem(0)} disabled={saving}>
                  <Plus className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Add Menu'}
                </Button>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>

            <div className="h-96 overflow-y-auto pr-1">
              <List
                dataSource={configuredMenus
                  .slice()
                  .sort((a, b) => a.orderIndex - b.orderIndex)}
                keyExpr="id"
                repaintChangesOnly={true}
                className="h-full"
                itemRender={(itemData: NavigationMenu) => renderMenuItem(itemData)}
              >
                <ItemDragging
                  allowReordering={true}
                  group="navMenus"
                  data="configuredMenus"
                  onDragStart={onDragStart}
                  onAdd={onAdd}
                  onRemove={onRemove}
                  onReorder={onReorder}
                />
              </List>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Structure Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Navigation Structure Preview</CardTitle>
          <CardDescription>
            Current navigation menu hierarchy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {renderPreviewItems(configuredMenus)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
