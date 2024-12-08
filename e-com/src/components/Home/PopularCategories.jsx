import { Link } from 'react-router-dom';
import '../../styles/categories.css';

const PopularCategories = () => {
  const categories = [
    {
      id: 1,
      name: 'Elektronik',
      image: 'https://images.unsplash.com/photo-1635870723802-e88d76ae324e?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      link: '/kategori/elektronik'
    },
    {
      id: 2,
      name: 'Giyim',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=500&h=500&fit=crop',
      link: '/kategori/giyim'
    },
    {
      id: 3,
      name: 'Ev & Yaşam',
      image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=500&h=500&fit=crop',
      link: '/kategori/ev-yasam'
    },
    {
      id: 4,
      name: 'Kozmetik',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      link: '/kategori/kozmetik'
    },
    {
      id: 5,
      name: 'Ayakkabı & Çanta',
      image: 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      link: '/kategori/ayakkabi-canta'
    },
    {
      id: 6,
      name: 'Spor & Outdoor',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=500&h=500&fit=crop',
      link: '/kategori/spor-outdoor'
    }
  ];

  return (
    <section className="popular-categories">
      <h2 className="section-title">Popüler Kategoriler</h2>
      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <Link to={category.link}>
              <img src={category.image} alt={category.name} />
              <div className="category-content">
                <h3>{category.name}</h3>
                <span className="arrow">→</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularCategories; 