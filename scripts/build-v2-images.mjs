/**
 * Builds the optimised image set used by the v2 layouts (public/images/v2/).
 * Each entry produces  <name>.jpg (≤2000px wide) and <name>-sm.jpg (≤1000px wide).
 * Re-run after replacing photos:  node scripts/build-v2-images.mjs
 */
import sharp from 'sharp';
import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const PUB = 'public';
const OUT = join(PUB, 'images/v2');
mkdirSync(OUT, { recursive: true });

const SOURCES = {
  // ── Fidel ──
  'fidel-exterior':   'images/buildings/fidel/exterior-autumn.jpg',
  'fidel-facade':     'фото бц/IMG_4955_1.jpg',
  'fidel-entrance':   'фото бц/вход в БЦ.jpg',
  'fidel-lobby':      'фото бц/холл БЦ.jpg',
  'fidel-staircase':  'фото бц/3B8P7698.JPG',
  'fidel-lounge':     'фото бц/web (128).jpg',
  'fidel-kitchen':    'fidel/3D_Isometric_Map_QIz-MPRJ.png',
  'fidel-kitchen-2':  'фото бц/web (135).jpg',
  'fidel-openspace':  'фото бц/web (108).jpg',
  'fidel-openspace-2':'фото бц/web (112).jpg',
  'fidel-terrace':    'фото бц/web (55).jpg',
  'fidel-river':      'фото бц/web (59).jpg',
  'fidel-meeting':    'фото бц/web (30).jpg',
  'fidel-meeting-2':  'фото бц/web (72).jpg',
  'fidel-slide':      'фото бц/web (22).jpg',
  'fidel-window':     'фото бц/web (144).jpg',
  'fidel-orange':     'фото бц/web (77).jpg',
  'fidel-team':       'фото бц/Нордиджи (6).jpeg',
  'fidel-team-2':     'фото бц/Нордиджи (19).jpeg',
  'fidel-fitness':    'фото бц/image_2026-04-23_13-54-55 (1).png',
  'fidel-courtyard':  'images/buildings/fidel/courtyard-garden.jpg',
  // ── ANM (АБК) ──
  'anm-panorama':     'abk/Group 9 (1).png',
  'anm-exterior':     'abk/img_4844_mini.jpg',
  'anm-reception':    'abk/abk2.jpg',
  'anm-cafe':         'abk/3D_Isometric_Map_In_a_modern_cafe_style_a_dark_wood_counter_RvClOnr.png',
  'anm-coworking':    'abk/park_1.jpg',
  'anm-conference':   'abk/park_2.jpg',
  'anm-lift':         'abk/abk_lift3.jpg',
  'anm-arch':         'abk/sme_6510.png',
  'anm-corridor':     'images/buildings/anm/corridor-offices.jpg',
  'anm-lobby':        'abk/photo_2026-04-15 11.56.33.jpeg',
  'anm-courtyard':    'abk/3D_Isometric_Map_YuoiDpz-.png',
  'anm-office':       'abk/3D_Isometric_Map_In_a_modern_office_style_this_scene_features_a.jpg',
  'anm-dining':       'abk/3D_Isometric_Map_An_empty_restaurant_dining_area_is_depicted_with.png',
  // ── Territory ──
  'territory-parking':   'фото бц/web (81).jpg',
  'territory-neva':      'фото бц/Нева 3.jpg',
  'territory-aerial':    'images/home/aerial-12.jpg',
  'territory-aerial-2':  'images/home/aerial-17_5.jpg',
  'territory-aerial-3':  'images/home/aerial-6.jpg',
  'territory-aerial-4':  'images/home/aerial-20_4.jpg',
};

/**
 * Original content images referenced by data files / pages. They are optimised
 * under a hashed name; <Img src="/original/path.jpg"> resolves them via the manifest.
 */
const PATHS = [
  // Building features & infrastructure (src/data/buildings.ts)
  '/фото бц/web (119).jpg',
  '/фото бц/SME_6636.JPG',
  '/fidel/photo_2026-03-16 19.41.01.jpeg',
  '/fidel/3D_Isometric_Map_QIz-MPRJ.png',
  '/fidel/dsc00480.jpg',
  '/images/infrastructure/neva-embankment.jpg',
  '/фото бц/Нева 3.jpg',
  '/abk/3D_Isometric_Map_The_scene_depicts_a_modern_conference_room_pNryGLWH.png',
  '/abk/photo_2026-03-16 21.24.20.jpeg',
  '/abk/abk_reception.jpg',
  '/abk/3D_Isometric_Map_YuoiDpz-.png',
  // Territory / about pages
  '/images/infrastructure/parking-aerial.jpg',
  '/images/buildings/anm/abk-cafe-new.jpg',
  '/фото бц/image_2026-04-23_13-54-55 (1).png',
  '/images/about/territory-drone.jpg',
  '/images/about/territory-panorama-new.jpg',
  '/images/buildings/fidel/interior-1.jpg',
  '/фото бц/web (27).jpg',
  '/territory/DJI_0739 (1) (1).jpg',
  // History timeline
  '/history/3D_Isometric_Map_In_a_vintage_industrial_style_a_large_textile_Z2ehCCb2.png',
  '/history/3D_Isometric_Map_A_large_brick_building_is_undergoing_demolition.png',
  '/history/3D_Isometric_Map_MoUcVrn8.png',
  '/history/_DSC3708.jpg',
  '/history/3D_Isometric_Map_In_a_architectural_visualization_style_this_7tyc4192.png',
  '/history/вид слева.JPG',
  '/history/image_2026-03-24_17-51-39.png',
];
const hashed = (path) => 'p-' + createHash('sha1').update(path).digest('hex').slice(0, 10);
const entries = [
  ...Object.entries(SOURCES).map(([name, src]) => [name, src, '/' + src]),
  ...PATHS.map((path) => [hashed(path), path.slice(1), path]),
];

const manifest = {};
for (const [name, src, original] of entries) {
  const file = join(PUB, src);
  if (!existsSync(file)) { console.warn('missing', src); continue; }
  if (existsSync(join(OUT, `${name}.jpg`)) && existsSync(join(OUT, `${name}-sm.jpg`)) && !process.argv.includes('--force')) {
    const meta = await sharp(join(OUT, `${name}.jpg`)).metadata();
    const sm = await sharp(join(OUT, `${name}-sm.jpg`)).metadata();
    manifest[name] = { w: meta.width, h: meta.height, smW: sm.width, src: original };
    continue;
  }
  for (const [suffix, width, q] of [['', 2000, 78], ['-sm', 1000, 76]]) {
    await sharp(file)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality: q, mozjpeg: true, progressive: true })
      .toFile(join(OUT, `${name}${suffix}.jpg`));
  }
  const meta = await sharp(join(OUT, `${name}.jpg`)).metadata();
  const sm = await sharp(join(OUT, `${name}-sm.jpg`)).metadata();
  manifest[name] = { w: meta.width, h: meta.height, smW: sm.width, src: original };
  console.log(name.padEnd(20), `${meta.width}x${meta.height}`);
}
// Dimensions manifest consumed by src/components/Img.astro (prevents layout shift)
writeFileSync('src/data/media-v2.json', JSON.stringify(manifest, null, 2) + '\n');
