import type { Building } from '@utils/types';

export const buildings: Building[] = [
  {
    name: 'Фидель',
    slug: 'fidel',
    class: 'B+',
    address: 'Санкт-Петербург, Пр. Обуховской Обороны д. 70',
    shortAddress: 'Пр. Обуховской Обороны, 70',
    metro: [
      {
        name: 'Елизаровская',
        line: 'Невско-Василеостровская',
        lineColor: '#009A49',
        walkingMinutes: 5,
      },
    ],
    stats: [
      { value: 5, label: 'Этажей' },
      { value: '12 205,5', label: 'Общая площадь', unit: 'м²' },
      { value: 218, label: 'Машиномест' },
      { value: 'B+', label: 'Класс' },
    ],
    description: 'Бизнес-лофт класса B+ на территории Александро-Невской Мануфактуры. Дизайнерская отделка в стиле лофт, современные инженерные системы, развитая инфраструктура и прогулочная зона на набережной Невы.',
    heroImage: '/images/buildings/fidel/facade.jpg',
    galleryImages: [
      '/images/buildings/fidel/facade-aerial.jpg',
      '/images/buildings/fidel/lounge-brick-green.jpg',
      '/images/buildings/fidel/lounge-mountain.jpg',
      '/images/buildings/fidel/lobby-staircase.jpg',
      '/images/buildings/fidel/openspace-loft.jpg',
      '/images/buildings/fidel/office-glass-brick.jpg',
      '/images/buildings/fidel/office-river-view.jpg',
      '/images/buildings/fidel/meeting-colorful.jpg',
      '/images/buildings/fidel/interior-brick-lounge.jpg',
      '/images/buildings/fidel/rooftop-terrace.jpg',
      '/images/buildings/fidel/courtyard-garden.jpg',
      '/images/buildings/fidel/exterior-night.jpg',
    ],
    features: [
      {
        title: 'Архитектура и дизайн',
        description: 'Бизнес-лофт с дизайнерской отделкой: ламинат, окрашенные стены (кирпич и гипсокартон), подвесные светильники, двухкамерные стеклопакеты. Уникальный характер промышленного здания сохранён и подчёркнут современными решениями.',
        image: '/images/buildings/fidel/office-river-view.jpg',
        imageAlt: 'Лофт-офис с кирпичными стенами и видом на Неву в бизнес-центре Фидель',
      },
      {
        title: 'Инженерное оснащение',
        description: 'Электроснабжение II категории надежности, централизованное кондиционирование Ciat, приточно-вытяжная вентиляция, собственная газовая котельная, пожарная сигнализация, 4 лифта, 6 телеком-операторов.',
        image: '/images/buildings/fidel/exterior-side.jpg',
        imageAlt: 'Фасад бизнес-центра Фидель с современной надстройкой',
      },
      {
        title: 'Сервис и управление',
        description: 'Профессиональная управляющая компания с 20-летним опытом. Круглосуточный доступ, служба эксплуатации, клининг, охрана территории.',
        image: '/images/buildings/fidel/lobby-mountain.jpg',
        imageAlt: 'Ресепшн бизнес-центра Фидель с дизайнерским оформлением',
      },
    ],
    parameters: [
      { label: 'Класс', value: 'B+' },
      { label: 'Этажей', value: '5' },
      { label: 'Общая площадь', value: '12 205,5 м²' },
      { label: 'Площадь типового этажа', value: '2 200 м²' },
      { label: 'Год реконструкции', value: '2008' },
      { label: 'Электроснабжение', value: 'II категория надежности' },
      { label: 'Кондиционирование', value: 'Централизованное (Ciat)' },
      { label: 'Вентиляция', value: 'Приточно-вытяжная' },
      { label: 'Отопление', value: 'Автономное, газовая котельная' },
      { label: 'Высота потолков', value: '3–4,2 м' },
      { label: 'Нагрузка на перекрытия', value: '200 кг/м²' },
      { label: 'Лифты', value: '4 лифта OTIS, грузоподъёмность до 1000 кг' },
      { label: 'Пожарная сигнализация', value: 'Система «умный дом»' },
      { label: 'Телеком-операторы', value: '6 операторов' },
      { label: 'Паркинг', value: 'Охраняемый, освещённый, 218 мест' },
    ],
    infrastructure: [
      {
        name: 'Кафе и столовая',
        description: 'Уютное кафе с широким меню на территории бизнес-центра. Горячие обеды, бизнес-ланчи, выпечка и напитки.',
        image: '/images/infrastructure/cafe.jpg',
        imageAlt: 'Кафе на территории бизнес-центра Фидель',
      },
      {
        name: 'Охраняемый паркинг',
        description: 'Охраняемый освещённый паркинг на 218 машиномест с круглосуточным доступом.',
        image: '/images/infrastructure/parking-aerial.jpg',
        imageAlt: 'Охраняемый паркинг территории Александро-Невской Мануфактуры',
      },
      {
        name: 'Охрана и безопасность',
        description: 'Круглосуточная охрана территории, система контроля доступа, видеонаблюдение, пожарная сигнализация.',
        image: '/images/buildings/fidel/entrance-close.jpg',
        imageAlt: 'Главный вход бизнес-центра Фидель с системой контроля доступа',
      },
      {
        name: 'Ресепшн',
        description: 'Профессиональная служба ресепшн, помощь арендаторам и посетителям.',
        image: '/images/buildings/fidel/entrance-main.jpg',
        imageAlt: 'Вход и ресепшн бизнес-центра Фидель',
      },
      {
        name: 'Набережная Невы',
        description: 'Прогулочная зона на набережной Невы — уникальная особенность территории для отдыха сотрудников.',
        image: '/images/infrastructure/neva-embankment.jpg',
        imageAlt: 'Вид на Неву с территории бизнес-центра',
      },
    ],
    faq: [
      {
        question: 'Каковы условия аренды?',
        answer: 'Условия аренды обсуждаются индивидуально. Свяжитесь с коммерческим отделом по телефону +7 (812) 336-55-64 для получения актуального предложения.',
      },
      {
        question: 'Какой минимальный срок аренды?',
        answer: 'Минимальный срок аренды — 11 месяцев. Возможны индивидуальные условия при долгосрочной аренде.',
      },
      {
        question: 'Включены ли коммунальные услуги в стоимость?',
        answer: 'Базовая арендная ставка включает эксплуатационные расходы. Коммунальные услуги (электричество, вода) оплачиваются отдельно по счётчикам.',
      },
      {
        question: 'Есть ли возможность перепланировки?',
        answer: 'Возможность перепланировки обсуждается индивидуально с управляющей компанией. Мы готовы адаптировать помещение под ваши потребности.',
      },
      {
        question: 'Как работает паркинг?',
        answer: 'Охраняемый освещённый паркинг на 218 мест. Парковочное место можно арендовать дополнительно.',
      },
    ],
    presentationUrl: '/documents/presentations/fidel-presentation.pdf',
    coordinates: { lat: 59.9075, lng: 30.4267 },
    order: 1,
  },
  {
    name: 'БЦ АНМ',
    slug: 'anm',
    class: 'B',
    address: 'Санкт-Петербург, Пр. Обуховской Обороны д. 70, корпус 2',
    shortAddress: 'Пр. Обуховской Обороны, 70к2',
    metro: [
      {
        name: 'Елизаровская',
        line: 'Невско-Василеостровская',
        lineColor: '#009A49',
        walkingMinutes: 5,
      },
    ],
    stats: [
      { value: 6, label: 'Этажей' },
      { value: '9 170,7', label: 'Общая площадь', unit: 'м²' },
      { value: 110, label: 'Машиномест' },
      { value: 'B', label: 'Класс' },
    ],
    description: 'Бизнес-центр на территории Александро-Невской Мануфактуры. Современные офисные помещения с качественной отделкой, удобная транспортная доступность и полная инфраструктура для бизнеса.',
    heroImage: '/images/buildings/anm/exterior-2.jpg',
    galleryImages: [
      '/images/buildings/anm/group-9.png',
      '/images/buildings/anm/abk-reception.jpg',
      '/images/buildings/anm/sme-6510.png',
      '/images/buildings/anm/abk-cafe-gallery.jpg',
      '/images/buildings/anm/corridor-green.jpg',
      '/images/buildings/anm/abk-coworking.jpg',
    ],
    features: [
      {
        title: 'Расположение',
        description: 'Бизнес-центр расположен на территории исторической Александро-Невской Мануфактуры, в 5 минутах ходьбы от метро Елизаровская.',
        image: '/images/buildings/anm/exterior-1.jpg',
        imageAlt: 'Фасад Бизнес-Центра АНМ',
      },
      {
        title: 'Современные офисы',
        description: 'Качественная отделка, современные инженерные системы, гибкие планировки для компаний любого размера.',
        image: '/images/buildings/anm/lobby-glass.jpg',
        imageAlt: 'Холл Бизнес-Центра АНМ со стеклянной входной группой',
      },
      {
        title: 'Паркинг',
        description: 'Просторный охраняемый паркинг на территории комплекса — удобный доступ для арендаторов и гостей.',
        image: '/images/infrastructure/parking-aerial.jpg',
        imageAlt: 'Охраняемый паркинг территории Александро-Невской Мануфактуры',
      },
    ],
    parameters: [
      { label: 'Класс', value: 'B' },
      { label: 'Этажей', value: '6' },
      { label: 'Общая площадь', value: '9 170,7 м²' },
      { label: 'Электроснабжение', value: 'II категория надежности' },
      { label: 'Кондиционирование', value: 'Централизованное' },
      { label: 'Вентиляция', value: 'Приточно-вытяжная' },
      { label: 'Паркинг', value: 'Охраняемый, 110 мест' },
    ],
    infrastructure: [
      {
        name: 'Ресепшн',
        description: 'Профессиональная служба ресепшн и просторный вестибюль для арендаторов и посетителей.',
        image: '/images/buildings/anm/lobby-interior.jpg',
        imageAlt: 'Ресепшн и вестибюль Бизнес-Центра АНМ',
      },
      {
        name: 'Лифты и лестницы',
        description: 'Современные лифты и светлые лестничные пролёты с элементами исторической кирпичной кладки.',
        image: '/images/buildings/anm/staircase-panoramic.jpg',
        imageAlt: 'Лестничный пролёт Бизнес-Центра АНМ',
      },
      {
        name: 'Охраняемый паркинг',
        description: 'Охраняемый паркинг на 110 машиномест с круглосуточным доступом.',
        image: '/images/infrastructure/parking-aerial.jpg',
        imageAlt: 'Охраняемый паркинг территории',
      },
      {
        name: 'Кафе и столовая',
        description: 'Общая инфраструктура территории: кафе, столовая, банкоматы.',
        image: '/images/infrastructure/cafe.jpg',
        imageAlt: 'Кафе на территории БЦ АНМ',
      },
    ],
    faq: [
      {
        question: 'Как связаться с коммерческим отделом?',
        answer: 'Позвоните по телефону +7 (812) 336-55-64 или напишите на arenda@ukanm.ru.',
      },
    ],
    coordinates: { lat: 59.9078, lng: 30.4272 },
    order: 2,
  },
];

export function getBuildingBySlug(slug: string): Building | undefined {
  return buildings.find((b) => b.slug === slug);
}
