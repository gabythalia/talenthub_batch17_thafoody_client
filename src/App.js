
// File: client/src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { FaShoppingCart } from 'react-icons/fa'; // Import logo keranjang
import { FaTiktok } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
// import { FaGithub } from "react-icons/fa";

function App() {
    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState({}); // Use an object to track item quantities
    const [notificationItem, setNotificationItem] = useState(null); // State for dropdown notification
    const [isCartOpen, setIsCartOpen] = useState(false); // State for cart modal

    useEffect(() => {
        fetch('http://localhost:5000/api/menu')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setMenu(data);
            })
            .catch(error => console.error('Error fetching menu:', error));
    }, []);

    const addToCart = (item) => {
        setCart(prevCart => ({
            ...prevCart,
            [item.id]: (prevCart[item.id] || 0) + 1 // Increment quantity for the item
        }));

        // Show dropdown notification
        setNotificationItem(item);

        // Hide notification after 2 seconds
        setTimeout(() => setNotificationItem(null), 2000);
    };

    // Fungsi untuk memformat harga menjadi Rupiah
    const formatRupiah = (amount) => {
        return `Rp${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
    };

    // Fungsi untuk menghapus item dari keranjang
    const removeFromCart = (itemId) => {
        setCart((prevCart) => {
            const newCart = { ...prevCart };
            delete newCart[itemId];
            return newCart;
        });
    };

    return (
        <div className="App bg-white min-h-screen flex flex-col justify-between">
            {/* Navbar */}
            <nav className="navbar">
                <div className="logo-container">
                    <img src="/logo-project.png" alt="Logo" className="logo-image" />
                    <h1 className="app-title font-semibold font-mono">ThaFoody</h1>
                </div>
                <div
                    className="cart-container relative p-2 bg-amber-900 text-white rounded-full cursor-pointer hover:bg-amber-800 transition duration-300 shadow-lg"
                    onClick={() => setIsCartOpen(!isCartOpen)}
                >
                    <FaShoppingCart size={24} />
                    <div className="cart-badge absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                        {Object.values(cart).reduce((total, qty) => total + qty, 0)} {/* Total items */}
                    </div>
                </div>
            </nav>

            {/* Modal Keranjang */}
            {isCartOpen && (
                <div className="cart-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-11/12 sm:w-96 max-w-md">
                        <h2 className="text-lg sm:text-xl font-bold mb-4 text-center text-stone-700">Daftar Pesanan</h2>
                        {Object.keys(cart).length === 0 ? (
                            <p className="text-center text-stone-700">Keranjang kosong.</p>
                        ) : (
                            <ul className="space-y-3">
                                {Object.entries(cart).map(([id, qty]) => {
                                    const item = menu.find((item) => item.id === parseInt(id));
                                    return (
                                        <li
                                            key={id}
                                            className="flex justify-between items-center border-b pb-2"
                                        >
                                            <span className="text-sm sm:text-base font-medium text-stone-500">{item.name}</span>
                                            <span className="text-sm sm:text-base text-stone-500">{qty}x</span>
                                            <button
                                                onClick={() => removeFromCart(id)}
                                                className="text-red-600 text-xs sm:text-sm"
                                            >
                                                Hapus
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="mt-6 bg-amber-900 text-white py-2 px-4 rounded-lg hover:bg-amber-800 transition duration-300 block mx-auto"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {/* Menu */}
            <div className="menu-container">
                {menu.map((item) => (
                    <div key={item.id} className={`menu-item ${cart[item.id] ? 'disabled' : ''}`}>
                        <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="menu-image"
                            onError={(e) => (e.target.src = '/placeholder.png')}
                        />
                        <h2 className='text-xl font-bold text-center text-stone-800'>{item.name}</h2>
                        <p className='text-sm text-gray-500 italic text-center'>Jenis: {item.type}</p>
                        <p className='text-lg font-semibold text-amber-600 text-center'>
                            Harga: {formatRupiah(item.price)}
                        </p>
                        <button
                            onClick={() => addToCart(item)}
                            disabled={!!cart[item.id]} // Disable button if the item is already in the cart
                            className="btn bg-amber-900 text-white font-semibold py-2 px-3 focus:outline-none focus:ring-0 rounded-lg shadow-lg hover:bg-amber-800 hover:shadow-md transform hover:-translate-y-1 transition duration-300 mx-auto block"
                        >
                            {cart[item.id] ? 'Added' : 'Add to Cart'}
                        </button>
                    </div>
                ))}
            </div>

            {/* Dropdown Notification */}
            {notificationItem && (
                <div
                    className="notification-container fixed bottom-5 right-5 bg-amber-800 text-white rounded-lg shadow-lg p-4 z-50"
                >
                    <h3 className="font-bold text-lg">Item Ditambahkan</h3>
                    <p>{notificationItem.name} berhasil ditambahkan ke keranjang.</p>
                </div>
            )}

            {/* Footer */}
            <footer className="footer bg-neutral text-neutral-content flex flex-col items-center justify-center p-4">
            {/* Logo dan Teks Copyright */}
                <div className="flex items-center justify-center mb-4">
                    <img src="/logo-project.png" alt="Logo" className="logo-footer w-10 h-10" />
                    <p className="ml-2 text-center">
                        Copyright © {new Date().getFullYear()} Thafoody Inc. by Gabrielle Thalia
                    </p>
                    <img src="/logo-project.png" alt="Logo" className="logo-footer w-10 h-10" />
                </div>

  {/* Ikon Media Sosial dengan Link */}
                <div className="flex gap-4">
                    <a href="https://www.instagram.com/gabythalia_" target="_blank" rel="noopener noreferrer">
                        <FaInstagram className="text-xl hover:text-rose-700 cursor-pointer" />
                    </a>
                    <a href="https://www.youtube.com/@gabythalia17" target="_blank" rel="noopener noreferrer">
                        <FaYoutube className="text-xl hover:text-red-600 cursor-pointer" />
                    </a>
                    <a href="https://www.tiktok.com/@gabythalia17" target="_blank" rel="noopener noreferrer">
                        <FaTiktok className="text-xl hover:text-black cursor-pointer" />
                    </a>
                </div>
            </footer>
        </div>
    );
}

export default App;






// import React, { useState, useEffect } from 'react';
// import './App.css';
// import { FaShoppingCart } from 'react-icons/fa'; // Import logo keranjang

// function App() {
//     const [menu, setMenu] = useState([]);
//     const [cart, setCart] = useState({}); // Use an object to track item quantities

//     useEffect(() => {
//         fetch('http://localhost:5000/api/menu')
//             .then(response => response.json())
//             .then(data => {
//                 console.log(data);
//                 setMenu(data);
//     })
//             .catch(error => console.error('Error fetching menu:', error));
//     }, []);

//     const addToCart = (item) => {
//         setCart(prevCart => ({
//             ...prevCart,
//             [item.id]: (prevCart[item.id] || 0) + 1 // Increment quantity for the item
//         }));
//     };

//     return (
//         <div className="App">
//             <nav className="navbar">
//                 <div className="logo-container">
//                     <img src="/logo-project.png" alt="Logo" className="logo-image" />
//                     <h1 className="app-title ">ThaFoody</h1>
//                 </div>
//                 <div className="cart-container">
//                     <FaShoppingCart size={24} /> {/* Logo keranjang */}
//                     <div className="cart-quantity">
//                         {Object.values(cart).reduce((total, qty) => total + qty, 0)} {/* Total items */}
//                     </div>
//                 </div>
//             </nav>
//             <div className="menu-container">
//                 {menu.map((item) => (
//                     <div key={item.id} className={`menu-item ${cart[item.id] ? 'disabled' : ''}`}>
//                         <img src={item.imageUrl} alt={item.name} className="menu-image" 
                        
                        
//                         // onError={(e) => (e.target.src = '/placeholder.png')}
//                     />
//                         {/* {item.image} */}
//                         <h2>{item.name}</h2>
//                         <p>Jenis: {item.type}</p>
//                         <p>Harga: ${item.price}</p>
//                         <button
//                             onClick={() => addToCart(item)}
//                             disabled={!!cart[item.id]} // Disable button if the item is already in the cart
//                         >
//                             {cart[item.id] ? 'Added' : 'Add to Cart'}
//                         </button>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default App;
// ===============================

// import React, { useState, useEffect } from 'react';
// import './App.css';
// import { FaShoppingCart } from 'react-icons/fa'; // Import logo keranjang

// function App() {
//     const [menu, setMenu] = useState([]);
//     const [cart, setCart] = useState({}); // Use an object to track item quantities

//     useEffect(() => {
//         fetch('http://localhost:5000/api/menu')
//             .then(response => response.json())
//             .then(data => setMenu(data))
//             .catch(error => console.error('Error fetching menu:', error));
//     }, []);

//     const addToCart = (item) => {
//         setCart(prevCart => ({
//             ...prevCart,
//             [item.id]: (prevCart[item.id] || 0) + 1 // Increment quantity for the item
//         }));
//     };

//     return (
//         <div className="App">
//             <nav className="navbar">
//                 <h1>ThaFoody</h1>
//                 <img className='' src='logo-project.png'></img>
//                 <div className="cart-container">
//                     <FaShoppingCart size={24} /> {/* Logo keranjang */}
//                     <div className="cart-quantity">
//                         {Object.values(cart).reduce((total, qty) => total + qty, 0)} {/* Total items */}
//                     </div>
//                 </div>
//             </nav>
//             <div className="menu-container">
//                 {menu.map((item) => (
//                     <div key={item.id} className={`menu-item ${cart[item.id] ? 'disabled' : ''}`}>
//                         <img src={item.image} alt={item.name} className="menu-image" />
//                         <h2>{item.name}</h2>
//                         <p>Type: {item.type}</p>
//                         <p>Price: ${item.price}</p>
//                         <button
//                             onClick={() => addToCart(item)}
//                             disabled={!!cart[item.id]} // Disable button if the item is already in the cart
//                         >
//                             {cart[item.id] ? 'Added' : 'Add to Cart'}
//                         </button>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default App;

// import React, { useState, useEffect } from 'react';
// import './App.css';

// function App() {
//     const [menu, setMenu] = useState([]);
//     const [cart, setCart] = useState([]);

//     useEffect(() => {
//         fetch('http://localhost:5000/api/menu')
//             .then(response => response.json())
//             .then(data => setMenu(data))
//             .catch(error => console.error('Error fetching menu:', error));
//     }, []);

//     const addToCart = (item) => {
//         if (!cart.some(cartItem => cartItem.id === item.id)) {
//             setCart([...cart, item]);
//         }
//     };

//     return (
//         <div className="App">
//             <nav className="navbar">
//                 <h1>Food Order</h1>
//                 <div className="cart-container">
//                     <h2>Cart</h2>
//                     {cart.map((item, index) => (
//                         <p key={index}>{item.name} - ${item.price}</p>
//                     ))}
//                 </div>
//             </nav>
//             <div className="menu-container">
//                 {menu.map((item) => (
//                     <div key={item.id} className="menu-item">
//                         <img src={item.image} alt={item.name} className="menu-image" />
//                         <h2>{item.name}</h2>
//                         <p>Type: {item.type}</p>
//                         <p>Price: ${item.price}</p>
//                         <button onClick={() => addToCart(item)} disabled={cart.some(cartItem => cartItem.id === item.id)}>
//                             {cart.some(cartItem => cartItem.id === item.id) ? 'Added' : 'Add to Cart'}
//                         </button>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default App;




// import React, { useState, useEffect } from 'react';
// import './App.css';

// function App() {
//     const [menu, setMenu] = useState([]);
//     const [cart, setCart] = useState([]);

//     useEffect(() => {
//         fetch('http://localhost:5000/api/menu')
//             .then(response => response.json())
//             .then(data => setMenu(data))
//             .catch(error => console.error('Error fetching menu:', error));
//     }, []);

//     const addToCart = (item) => {
//         if (!cart.some(cartItem => cartItem.id === item.id)) {
//             setCart([...cart, item]);
//         }
//     };

//     return (
//         <div className="App">
//             <nav className="navbar">
//                 <h1>Food Order</h1>
//             </nav>
//             <div className="menu-container">
//                 {menu.map((item) => (
//                     <div key={item.id} className="menu-item">
//                         <img src={item.image} alt={item.name} className="menu-image" />
//                         <h2>{item.name}</h2>
//                         <p>Type: {item.type}</p>
//                         <p>Price: ${item.price}</p>
//                         <button onClick={() => addToCart(item)} disabled={cart.some(cartItem => cartItem.id === item.id)}>
//                             {cart.some(cartItem => cartItem.id === item.id) ? 'Added' : 'Add to Cart'}
//                         </button>
//                     </div>
//                 ))}
//             </div>
//             <div className="cart-container">
//                 <h2>Cart</h2>
//                 {cart.map((item, index) => (
//                     <p key={index}>{item.name} - ${item.price}</p>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default App;




// ======================================
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function App() {
//   const [menu, setMenu] = useState([]);
//   const [cart, setCart] = useState([]);

//   // Fetch menu data dari backend
//   useEffect(() => {
//     axios.get('http://localhost:5000/api/menu')
//       .then(response => {
//         setMenu(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching data:', error);
//       });
//   }, []);

//   // Fungsi untuk menambahkan item ke keranjang
//   const addToCart = (item) => {
//     setCart([...cart, item]);
//   };

//   return (
//     <div>
//       <nav>
//         <ul>
//           <li><a href="#menu">Menu</a></li>
//           <li><a href="#cart">Keranjang ({cart.length})</a></li>
//         </ul>
//       </nav>

//       <section id="menu">
//         <h2>Menu Makanan</h2>
//         <div style={{ display: 'flex', flexWrap: 'wrap' }}>
//           {menu.map(item => (
//             <div key={item.id} style={{ margin: 20, border: '1px solid #ccc', padding: 10 }}>
//               <img src={item.imageUrl} alt={item.name} style={{ width: '200px', height: '150px' }} />
//               <h3>{item.name}</h3>
//               <p>{item.type}</p>
//               <p>Rp {item.price}</p>
//               <button onClick={() => addToCart(item)}>Tambah ke Keranjang</button>
//             </div>
//           ))}
//         </div>
//       </section>

//       <section id="cart">
//         <h2>Keranjang</h2>
//         {cart.length === 0 ? (
//           <p>Keranjang kosong.</p>
//         ) : (
//           <ul>
//             {cart.map((item, index) => (
//               <li key={index}>{item.name} - Rp {item.price}</li>
//             ))}
//           </ul>
//         )}
//       </section>
//     </div>
//   );
// }

// export default App;




// ============================

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
