const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SRC = '/sessions/charming-affectionate-feynman/mnt/anm-website/public/фото бц';
const DST = '/sessions/charming-affectionate-feynman/mnt/anm-website/public/images';

// Ensure directories exist
const dirs = [
  `${DST}/buildings/fidel`,
  `${DST}/buildings/anm`,
  `${DST}/infrastructure`,
  `${DST}/about`,
  `${DST}/common`,
];
dirs.forEach(d => fs.mkdirSync(d, { recursive: true }));

// Photo selections with target paths and max width
const selections = [
  // === FIDEL BUILDING ===
  // Hero/facade
  { src: 'DJI_0646.jpg', dst: 'buildings/fidel/facade-aerial.jpg', width: 1920 },
  { src: 'SME_7033.JPG', dst: 'buildings/fidel/facade-panoramic.jpg', width: 1920 },
  // Exterior views
  { src: 'SME_6660.JPG', dst: 'buildings/fidel/exterior-corner.jpg', width: 1600 },
  { src: 'SME_7041.JPG', dst: 'buildings/fidel/exterior-side.jpg', width: 1600 },
  { src: 'SME_7043.JPG', dst: 'buildings/fidel/exterior-tower.jpg', width: 1600 },
  { src: 'SME_6693.JPG', dst: 'buildings/fidel/exterior-end.jpg', width: 1600 },
  { src: 'SME_6833.JPG', dst: 'buildings/fidel/exterior-long.jpg', width: 1600 },
  { src: 'SME_6659.JPG', dst: 'buildings/fidel/exterior-parking.jpg', width: 1600 },
  // Entrance
  { src: 'SME_6854.JPG', dst: 'buildings/fidel/entrance-main.jpg', width: 1600 },
  { src: 'SME_6852.JPG', dst: 'buildings/fidel/entrance-close.jpg', width: 1600 },
  { src: 'вход в БЦ.jpg', dst: 'buildings/fidel/entrance-evening.jpg', width: 1600 },
  // Night
  { src: '049.jpg', dst: 'buildings/fidel/exterior-night.jpg', width: 1920 },
  // Interior - lobby/reception
  { src: 'web (1).jpg', dst: 'buildings/fidel/lobby-mountain.jpg', width: 1600 },
  { src: 'web (3).jpg', dst: 'buildings/fidel/lounge-mountain.jpg', width: 1600 },
  { src: 'web (4).jpg', dst: 'buildings/fidel/lobby-staircase.jpg', width: 1600 },
  // Interior - offices/open-space
  { src: 'web (10).jpg', dst: 'buildings/fidel/openspace-modern.jpg', width: 1600 },
  { src: 'web (40).jpg', dst: 'buildings/fidel/openspace-loft.jpg', width: 1600 },
  { src: 'web (50).jpg', dst: 'buildings/fidel/office-glass-brick.jpg', width: 1600 },
  { src: 'web (65).jpg', dst: 'buildings/fidel/openspace-mezzanine.jpg', width: 1600 },
  { src: 'web (95).jpg', dst: 'buildings/fidel/openspace-workstations.jpg', width: 1600 },
  { src: 'web (100).jpg', dst: 'buildings/fidel/office-layout.jpg', width: 1600 },
  { src: 'web (110).jpg', dst: 'buildings/fidel/office-river-view.jpg', width: 1600 },
  { src: 'web (130).jpg', dst: 'buildings/fidel/office-flexible.jpg', width: 1600 },
  { src: 'web (140).jpg', dst: 'buildings/fidel/office-brick-loft.jpg', width: 1600 },
  { src: 'web (170).jpg', dst: 'buildings/fidel/openspace-gray.jpg', width: 1600 },
  // Interior - meeting rooms
  { src: 'web (20).jpg', dst: 'buildings/fidel/meeting-glass.jpg', width: 1600 },
  { src: 'web (30).jpg', dst: 'buildings/fidel/meeting-colorful.jpg', width: 1600 },
  { src: 'web (70).jpg', dst: 'buildings/fidel/meeting-conference.jpg', width: 1600 },
  { src: 'web (85).jpg', dst: 'buildings/fidel/meeting-mountain.jpg', width: 1600 },
  { src: 'web (120).jpg', dst: 'buildings/fidel/meeting-green.jpg', width: 1600 },
  // Interior - special
  { src: 'web (90).jpg', dst: 'buildings/fidel/interior-brick-lounge.jpg', width: 1600 },
  { src: 'web (160).jpg', dst: 'buildings/fidel/staircase-brick.jpg', width: 1600 },
  { src: 'web (55).jpg', dst: 'buildings/fidel/rooftop-terrace.jpg', width: 1600 },
  { src: 'web (45).jpg', dst: 'buildings/fidel/interior-topfloor.jpg', width: 1600 },
  // Garden/park near Fidel
  { src: 'SME_6612.JPG', dst: 'buildings/fidel/courtyard-garden.jpg', width: 1600 },
  { src: 'SME_6978.JPG', dst: 'buildings/fidel/park-benches.jpg', width: 1600 },
  { src: 'fidel_012.jpg', dst: 'buildings/fidel/park-people.jpg', width: 1600 },
  // Bike parking
  { src: 'SME_6963.JPG', dst: 'buildings/fidel/bike-parking.jpg', width: 1600 },
  // Facade detail
  { src: 'IMG_4955_1.jpg', dst: 'buildings/fidel/facade-upward.jpg', width: 1600 },

  // === ANM BUILDING ===
  { src: 'холл БЦ.jpg', dst: 'buildings/anm/lobby-glass.jpg', width: 1600 },
  { src: '3B8P8270.JPG', dst: 'buildings/anm/lobby-interior.jpg', width: 1600 },
  { src: '3B8P7698.JPG', dst: 'buildings/anm/staircase-brick.jpg', width: 1600 },
  { src: 'ZAAA07922_.jpg', dst: 'buildings/anm/staircase-panoramic.jpg', width: 1600 },
  { src: 'Коридор.jpg', dst: 'buildings/anm/corridor-green.jpg', width: 1600 },
  { src: 'web (176).jpg', dst: 'buildings/anm/corridor-offices.jpg', width: 1600 },

  // === INFRASTRUCTURE ===
  { src: 'web (80).jpg', dst: 'infrastructure/parking-aerial.jpg', width: 1600 },
  { src: 'Нева 3.jpg', dst: 'infrastructure/neva-embankment.jpg', width: 1600 },

  // === ABOUT / TERRITORY ===
  { src: 'DJI_0466.jpg', dst: 'about/territory-drone.jpg', width: 1920 },
  { src: 'DJI_0238.jpg', dst: 'about/territory-panorama-new.jpg', width: 1920 },
  { src: 'DJI_0508.jpg', dst: 'about/territory-aerial-river.jpg', width: 1920 },
  { src: 'DJI_0398.jpg', dst: 'about/territory-neva-view.jpg', width: 1920 },

  // === HOMEPAGE HERO ===
  { src: 'DJI_0271.jpg', dst: 'common/territory-aerial-hero-new.jpg', width: 1920 },
];

async function processAll() {
  let success = 0;
  let failed = 0;
  for (const sel of selections) {
    const srcPath = path.join(SRC, sel.src);
    const dstPath = path.join(DST, sel.dst);
    try {
      await sharp(srcPath)
        .resize(sel.width, null, { withoutEnlargement: true })
        .jpeg({ quality: 82, progressive: true })
        .toFile(dstPath);
      const stats = fs.statSync(dstPath);
      const sizeKB = Math.round(stats.size / 1024);
      console.log(`OK: ${sel.dst} (${sizeKB}KB)`);
      success++;
    } catch (e) {
      console.error(`FAIL: ${sel.src} -> ${sel.dst}: ${e.message}`);
      failed++;
    }
  }
  console.log(`\nDone: ${success} success, ${failed} failed`);
}

processAll();
