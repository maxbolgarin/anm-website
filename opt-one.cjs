const sharp = require('sharp');
// Re-optimize café image from original at full width, ensuring it fills the card
sharp('/sessions/charming-affectionate-feynman/mnt/anm-website/public/abk/photo_2026-03-16 19.36.56.jpeg')
  .metadata()
  .then(m => {
    console.log('Original:', m.width + 'x' + m.height);
    return sharp('/sessions/charming-affectionate-feynman/mnt/anm-website/public/abk/photo_2026-03-16 19.36.56.jpeg')
      .resize(1600, null, { withoutEnlargement: true })
      .jpeg({ quality: 85, progressive: true })
      .toFile('/sessions/charming-affectionate-feynman/mnt/anm-website/public/images/buildings/anm/abk-cafe-new.jpg');
  })
  .then(info => console.log('Output:', info.width + 'x' + info.height, Math.round(info.size/1024) + 'KB'));
