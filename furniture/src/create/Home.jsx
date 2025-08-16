import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* <<<<< Banner Section >>>>> */}
      <div className="banner">
        <img
          src="https://cdn-bnokp.nitrocdn.com/QNoeDwCprhACHQcnEmHgXDhDpbEOlRHH/assets/images/optimized/rev-0318a68/www.decorilla.com/online-decorating/wp-content/uploads/2025/02/Contemporary-trendy-living-room-interior-design-styles-by-Decorilla-designer-Leanna-S-2048x1359.jpeg"
          alt="Banner"
          className="banner-image"
        />

        <div className="shop-overlay">
          <h1 className="shop-title">
            Discover The Best <br /> Furniture For You
          </h1>
          <button className="shop-button" onClick={() => navigate("/products")}>
            Shop Now
          </button>
        </div>
      </div>

      {/* <<<<< Categories Section >>>>> */}
      <div className="categories-section">
        <h4 className="categories-heading">Shop By Categories</h4>

        <div className="categories-grid">
          {[
            {
              name: "Living Room",
              img: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGl2aW5nJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
            },
            {
              name: "Bedroom",
              img: "https://media.istockphoto.com/id/2208103079/photo/comfortable-large-bed-in-beautiful-room-interior-design.webp?a=1&b=1&s=612x612&w=0&k=20&c=HNNomFZiXwvxAR_BOruTjfX_DStK0kDmnntanYOIM1w=",
            },
            {
              name: "Dining Room",
              img: "https://media.istockphoto.com/id/942801014/photo/dinner-table.jpg?s=612x612&w=0&k=20&c=1NnGeYkrmcE0cjX6dDtTjQGHh7zmk6QvKFYpgMe8SFs=",
            },
            {
              name: "Lamps & Lighting",
              img: "https://ii1.pepperfry.com/media/catalog/product/s/c/494x544/scholar-brown-wooden-table-lamp-by-smartway-scholar-brown-wooden-table-lamp-by-smartway-tcgyhw.jpg",
            },
          ].map((category, index) => (
            <div
              key={index}
              className="category-card"
              onClick={() => navigate("/products", { state: { category: category.name } })}
            >
              <img src={category.img} alt={category.name} className="category-img" />
              <div className="category-overlay">{category.name}</div>
            </div>

          ))}
        </div>

      </div>

      {/* <<<<< Deals of the Day >>>>> */}
      <div className="nearest-store-section">
        <h2 className="nearest-store-heading"><b>Deals of the day</b></h2>
        <div className="deal-image-row">
          <Link to="/products">
            <img
              src="https://ii1.pepperfry.com/assets/bcf8fe6a-221a-4e58-b793-a909f2561b78.jpg"
              alt="Deal 1"
              className="deal-image"
            />
          </Link>
          <Link to="/products">
            <img
              src="https://ii1.pepperfry.com/assets/b7ce8f30-37a5-4369-876e-82aedd027dec.jpg"
              alt="Deal 2"
              className="deal-image"
            />
          </Link>
        </div>
      </div>

      {/* <<<<< New Arrivals >>>>> */}
      <div className="top-sale">
        <h2 className="top-sale-heading"><b>New Arrivals</b></h2>
        <div className="top-image-row">
          {[

            {
              img: "https://ii1.pepperfry.com/media/catalog/product/a/s/494x544/aston-fabric-corner-sofa-in-mid-brown-colour-aston-fabric-corner-sofa-in-mid-brown-colour-jor0dc.jpg",
              name: "Marble Luxe Living"
            },
            {
              img: "https://ii1.pepperfry.com/media/catalog/product/t/o/494x544/toscana-king-size-bed-in-cream-colour-toscana-king-size-bed-in-cream-colour-orfyqu.jpg",
              name: "Cloud White Lounger"
            },
            {
              img: "https://ii1.pepperfry.com/media/catalog/product/p/a/494x544/panda-dining-table-panda-dining-table-irbniy.jpg",
              name: "Sculpted Stone Dining"
            },
            {
              img: "https://ii1.pepperfry.com/media/catalog/product/f/u/236x260/furrow-study-table-lamp-furrow-study-table-lamp-7x7sav.jpg",
              name: "Amber Glow Lamp"
            },
            {
              img: "https://ii1.pepperfry.com/media/catalog/product/o/x/494x544/oxley-coffee-table--arabescato-corchia-marble-oxley-coffee-table--arabescato-corchia-marble-nipx62.jpg",
              name: "Carrara Harmony"
            },
            {
              img: "https://ii1.pepperfry.com/media/catalog/product/s/c/494x544/scarla-boucle-cornor-sofa-in-white-colour-scarla-boucle-cornor-sofa-in-white-colour-vgs76l.jpg",
              name: "Minimal Elegance Sofa"
            }
          ].map((item, index) => (
            <Link to="/products" key={index}>
              <div className="top-image-wrapper">
                <img src={item.img} alt={item.name} className="top-image" />
                <p className="top-caption">{item.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>


      {/* <<<<< Luxury Section >>>>> */}
      <div className="luxury-section">
        <h2 className="luxury-heading"><b>Luxury Collection</b></h2>
        <div className="luxury-image-wrapper" onClick={() => navigate("/products")}>
          <img
            src="https://ii1.pepperfry.com/assets/4aaeedfa-e44d-4cfe-a097-c2d8f1d867b7.jpg"
            alt="Luxury Collection"
            className="luxury-image"
          />
          <div className="luxury-hover-text">Explore Luxury</div>
        </div>
      </div>


    </>
  );
};

export default Home;
