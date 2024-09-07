// Array con las URLs de las imágenes
const imageUrls = [
  'https://i.ibb.co/KwNDXYp/Comfy-UI-00512.png/300/0000FF/FFFFFF?text=Foto1',
  'https://i.ibb.co/5sjBYq2/Comfy-UI-00269.png/300/FF0000/FFFFFF?text=Foto2',
  'https://i.ibb.co/ccvfVFc/Comfy-UI-00489.png/300/00FF00/FFFFFF?text=Foto3',
  'https://i.ibb.co/Wg8zqF1/Comfy-UI-00494.png/300/FFFF00/FFFFFF?text=Foto4',
  'https://i.ibb.co/qrJcXwy/Comfy-UI-00476.png/300/FF00FF/FFFFFF?text=Foto5',
  'https://i.ibb.co/C2Q2trF/Comfy-UI-00107.png/300/00FFFF/FFFFFF?text=Foto6',
  'https://i.ibb.co/wdtDwbP/Comfy-UI-00323.png/300/FFFFFF/000000?text=Foto7',
  'https://i.ibb.co/GVfmFKq/Comfy-UI-00451.png/300/FFA500/FFFFFF?text=Foto8',
  'https://i.ibb.co/KctLhFz/Comfy-UI-00459.png/300/800080/FFFFFF?text=Foto9',
  'https://i.ibb.co/ZHN1sb1/Comfy-UI-00522.png/300/808080/FFFFFF?text=Foto10',
  'https://i.ibb.co/Z6S1gWS/Comfy-UI-00505.png/300/008080/FFFFFF?text=Foto11',
  'https://i.ibb.co/d23hMkD/Comfy-UI-00509.png/300/FF6347/FFFFFF?text=Foto12',
  'https://i.ibb.co/fGfzDT2/Comfy-UI-00515.png/300/4682B4/FFFFFF?text=Foto13',
  'https://i.ibb.co/k1NsdmY/Comfy-UI-00516.png/300/DAA520/FFFFFF?text=Foto14',
  'https://i.ibb.co/YtzZC1q/Comfy-UI-00518.png/300/CD5C5C/FFFFFF?text=Foto15',

];

// Variable para rastrear la imagen actual
let currentIndex = 0;

// Función para agregar las imágenes al grid
function loadGallery() {
  const gallery = document.getElementById('gallery');
  imageUrls.forEach((url, index) => {
    const img = document.createElement('img');
    img.src = url;
    img.alt = `Imagen ${index + 1}`;
    img.classList.add('gallery-item');
    img.onclick = () => openModal(index); // Abrir modal en el índice actual
    gallery.appendChild(img);
  });
}

// Abrir modal con la imagen seleccionada
function openModal(index) {
  currentIndex = index;
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const caption = document.getElementById('caption');

  modal.style.display = "block";
  modalImg.src = imageUrls[currentIndex];
  caption.textContent = `Imagen ${currentIndex + 1}`;
}

// Navegar a la imagen siguiente
function nextImage() {
  currentIndex = (currentIndex + 1) % imageUrls.length; // Navegar circularmente
  openModal(currentIndex);
}

// Navegar a la imagen anterior
function prevImage() {
  currentIndex = (currentIndex - 1 + imageUrls.length) % imageUrls.length; // Navegar circularmente
  openModal(currentIndex);
}

// Cerrar el modal
document.querySelector('.close').onclick = function() {
  document.getElementById('image-modal').style.display = "none";
}

// Manejar clics en las flechas de navegación
document.querySelector('.next').onclick = nextImage;
document.querySelector('.prev').onclick = prevImage;

// Cargar la galería al cargar la página
window.onload = loadGallery;
