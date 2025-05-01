import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const ShoppingLists = () => {
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState('');
  const [selectedListId, setSelectedListId] = useState(null);
  const [error, setError] = useState(null);
  const [listInputs, setListInputs] = useState({}); 

  // Configure axios to include credentials
  axios.defaults.withCredentials = true;

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await axios.get(`${API_URL}/shoppingList`, {
        withCredentials: true
      });
      const listsData = Array.isArray(response.data) ? response.data : [];
      
      const sortedLists = listsData.map(list => ({
        ...list,
        items: list.items ? [...list.items].sort((a, b) => 
          new Date(a.created_at) - new Date(b.created_at)
        ) : []
      }));
      
      setLists(sortedLists);
      setError(null);
    } catch (error) {
      setError('Failed to load shopping lists');
      setLists([]);
    }
  };

  const handleCreateList = async () => {
    if (!newListTitle.trim()) return;
    
    try {
      const response = await axios.post(`${API_URL}/shoppingList`, { title: newListTitle }, {
        withCredentials: true
      });
      setNewListTitle('');
      fetchLists();
    } catch (error) {
      setError('Failed to create shopping list');
    }
  };

  const handleAddItem = async (listId) => {
    const itemText = listInputs[listId] || '';
    if (!itemText.trim()) return;
    
    try {
      const response = await axios.post(`${API_URL}/shoppingList/${listId}/items`, { name: itemText }, {
        withCredentials: true
      });
      setListInputs(prev => ({ ...prev, [listId]: '' }));
      fetchLists();
    } catch (error) {
      setError('Failed to add item');
    }
  };

  const handleToggleItem = async (itemId, isChecked) => {
    try {
      const response = await axios.patch(`${API_URL}/shoppingList/items/${itemId}`, { is_checked: !isChecked }, {
        withCredentials: true
      });
      fetchLists();
    } catch (error) {
      setError('Failed to toggle item');
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await axios.delete(`${API_URL}/shoppingList/items/${itemId}`, {
        withCredentials: true
      });
      fetchLists();
    } catch (error) {
      setError('Failed to delete item');
    }
  };

  const handleInputChange = (listId, value) => {
    setListInputs(prev => ({ ...prev, [listId]: value }));
  };

  const handleDeleteList = async (listId) => {
    try {
      await axios.delete(`${API_URL}/shoppingList/${listId}`, {
        withCredentials: true
      });
      fetchLists();
    } catch (error) {
      setError('Failed to delete list');
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-300 min-h-screen">
      <div className="flex justify-center">
        <h1 className="text-3xl font-bold mb-8">Shopping Lists</h1>
      </div>
      
      {/* Add new list form */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex justify-center">
          <h2 className="text-xl font-semibold mb-4">Create New Shopping List</h2>
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            placeholder="Enter list title..."
            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleCreateList()}
          />
          <button
            onClick={handleCreateList}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create List
          </button>
        </div>
      </div>
      
      {!lists || lists.length === 0 ? (
        <div className="text-gray-500 text-center">No shopping lists found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {lists.map((list) => (
            <div 
              key={list.id} 
              className="rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col relative"
            >
              <div className="flex justify-center mb-4">
                <h2 className="text-xl font-semibold">{list.title}</h2>
                <button
                  onClick={() => handleDeleteList(list.id)}
                  className="text-gray-600 hover:text-gray-800 absolute right-4"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-0.5 mb-4 flex-grow">
                {list.items && list.items.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between py-1 px-2 hover:bg-gray-50 rounded"
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={item.is_checked}
                        onChange={() => handleToggleItem(item.id, item.is_checked)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 flex-shrink-0"
                      />
                      <span className={`truncate ${item.is_checked ? 'line-through text-gray-500' : ''}`}>
                        {item.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-gray-600 hover:text-gray-800 flex-shrink-0 ml-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center mt-2 space-x-2">
                <input
                  type="text"
                  value={listInputs[list.id] || ""}
                  onChange={(e) => handleInputChange(list.id, e.target.value)}
                  placeholder="Add new item"
                  className="flex-grow p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleAddItem(list.id)}
                  className="text-gray-600 hover:text-gray-800 w-8 h-8 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShoppingLists; 