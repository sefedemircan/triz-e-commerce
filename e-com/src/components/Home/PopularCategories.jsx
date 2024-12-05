const PopularCategories = () => {
  const categories = [
    {
      id: 1,
      name: 'Kazak',
      image: '/images/categories/Bluz_202212271854.webp',
      link: '/kategori/kazak'
    },
    {
      id: 2,
      name: 'İç Giyim',
      image: '/images/categories/Dis_Giyim_Kadin_202301031347.webp',
      link: '/kategori/ic-giyim'
    },
    {
      id: 3,
      name: 'Sweatshirt',
      image: '/images/categories/Sweat_202212302146.webp',
      link: '/kategori/sweatshirt'
    },
    {
      id: 4,
      name: 'Pantolon',
      image: '/images/categories/Pantolon_202212302146.webp',
      link: '/kategori/pantolon'
    },
    {
      id: 5,
      name: 'Dış Giyim',
      image: '/images/categories/Dis_Giyim_Kadin_202301031347.webp',
      link: '/kategori/dis-giyim'
    },
    {
      id: 6,
      name: 'Bluz',
      image: '/images/categories/Sweat_202212302146.webp',
      link: '/kategori/bluz'
    }
  ];

  return (
    <section className="popular-categories">
      <h2 className="section-title">Popüler Kategoriler</h2>
      <div className="categories-grid">
        {categories.map((category) => (
          <a key={category.id} href={category.link} className="category-card">
            <div className="category-image">
              <img src={category.image} alt={category.name} />
            </div>
            <h3>{category.name}</h3>
          </a>
        ))}
      </div>
    </section>
  );
};

export default PopularCategories; 