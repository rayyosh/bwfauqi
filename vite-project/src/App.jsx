import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Состояния для фильтрации, поиска и корзины
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Получаем данные с API при загрузке страницы
  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Ошибка при загрузке товаров');
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Получаем уникальные категории из списка товаров
  const categories = ['all', ...new Set(products.map((item) => item.category))];

  // Фильтруем товары по категории и поисковому запросу
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Добавление в корзину
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  return (
    <div className="app">
      {/* Шапка сайта */}
      <header className="header">
        <div className="container header-content">
          <h1 className="logo">FAKE<span>STORE</span></h1>
          
          <input
            type="text"
            className="search-input"
            placeholder="Поиск товаров..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="cart-badge">
            🛒 Корзина: <span>{cart.length}</span>
          </div>
        </div>
      </header>

      <main className="container">
        {/* Кнопки категорий */}
        <div className="categories">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'Все товары' : category}
            </button>
          ))}
        </div>

        {/* Состояния загрузки и ошибки */}
        {loading && <div className="status-msg">Загрузка товаров...</div>}
        {error && <div className="status-msg error">Ошибка: {error}</div>}

        {/* Сетка карточек */}
        {!loading && !error && (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div className="card" key={product.id}>
                <div 
                  className="card-img-wrapper"
                  onClick={() => setSelectedProduct(product)}
                >
                  <img src={product.image} alt={product.title} />
                  <span className="card-category">{product.category}</span>
                </div>

                <div className="card-body">
                  <div className="card-rating">
                    ⭐ {product.rating.rate} <span>({product.rating.count})</span>
                  </div>
                  
                  <h3 
                    className="card-title" 
                    title={product.title}
                    onClick={() => setSelectedProduct(product)}
                  >
                    {product.title}
                  </h3>

                  <div className="card-footer">
                    <span className="card-price">${product.price.toFixed(2)}</span>
                    <button 
                      className="add-btn"
                      onClick={() => addToCart(product)}
                    >
                      В корзину
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Модальное окно с деталями товара */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedProduct(null)}>
              ✕
            </button>
            <div className="modal-grid">
              <div className="modal-img">
                <img src={selectedProduct.image} alt={selectedProduct.title} />
              </div>
              <div className="modal-info">
                <span className="modal-cat">{selectedProduct.category}</span>
                <h2>{selectedProduct.title}</h2>
                <p className="modal-rating">
                  ⭐ {selectedProduct.rating.rate} ({selectedProduct.rating.count} отзывов)
                </p>
                <p className="modal-desc">{selectedProduct.description}</p>
                <div className="modal-bottom">
                  <span className="modal-price">${selectedProduct.price.toFixed(2)}</span>
                  <button 
                    className="add-btn"
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                  >
                    Добавить в корзину
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;