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
      { value: '14 000', label: 'Общая площадь', unit: 'м²' },
      { value: 500, label: 'Машиномест' },
      { value: 'B+', label: 'Класс' },
    ],
    description: 'Бизнес-лофт класса B+ на территории Александро-Невской Мануфактуры. Дизайнерская отделка в стиле лофт, современные инженерные системы, развитая инфраструктура и прогулочная зона на набережной Невы.',
    heroImage: '/images/buildings/fidel/facade.jpg',
    galleryImages: [
      '/images/buildings/fidel/exterior-wide.jpg',
      '/images/buildings/fidel/interior-1.jpg',
      '/images/buildings/fidel/interior-lounge.jpg',
      '/images/buildings/fidel/interior-colorful.jpg',
      '/images/buildings/fidel/interior-creative.jpg',
      '/images/buildings/fidel/lobby.jpg',
      '/images/buildings/fidel/lobby-anchor.jpg',
      '/images/buildings/fidel/interior-mountain.jpg',
      '/images/buildings/fidel/interior-nordic.jpg',
      '/images/buildings/fidel/interior-orange.jpg',
    ],
    features: [
      {
        title: 'Архитектура и дизайн',
        description: 'Бизнес-лофт с дизайнерской отделкой: ламинат, окрашенные стены (кирпич и гипсокартон), подвесные светильники, двухкамерные стеклопакеты. Уникальный характер промышленного здания сохранён и подчёркнут современными решениями.',
        image: '/images/buildings/fidel/interior-1.jpg',
        imageAlt: 'Лофт-офис с кирпичными стенами в бизнес-центре Фидель',
      },
      {
        title: 'Инженерное оснащение',
        description: 'Электроснабжение II категории надежности, централизованное кондиционирование Ciat, приточно-вытяжная вентиляция, собственная газовая котельная, пожарная сигнализация, 4 лифта, 6 телеком-операторов.',
        image: '/images/buildings/fidel/exterior-wide.jpg',
        imageAlt: 'Фасад бизнес-центра Фидель',
      },
      {
        title: 'Сервис и управление',
        description: 'Профессиональная управляющая компания с 15-летним опытом. Круглосуточный доступ, служба эксплуатации, клининг, охрана территории.',
        image: '/images/buildings/fidel/lobby.jpg',
        imageAlt: 'Ресепшн бизнес-центра Фидель',
      },
    ],
    parameters: [
      { label: 'Класс', value: 'B+' },
      { label: 'Этажей', value: '5' },
      { label: 'Общая площадь', value: '14 000 м²' },
      { label: 'Год реконструкции', value: '2010' },
      { label: 'Электроснабжение', value: 'II категория надежности' },
      { label: 'Кондиционирование', value: 'Централизованное (Ciat)' },
      { label: 'Вентиляция', value: 'Приточно-вытяжная' },
      { label: 'Отопление', value: 'Автономное, газовая котельная' },
      { label: 'Лифты', value: '4' },
      { label: 'Пожарная сигнализация', value: 'Да' },
      { label: 'Телеком-операторы', value: '6 операторов' },
      { label: 'Паркинг', value: 'Охраняемый, 500 мест' },
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
        description: 'Открытый охраняемый паркинг на 500 автомобилей с круглосуточным доступом.',
        image: '/images/common/territory-aerial.png',
        imageAlt: 'Территория Александро-Невской Мануфактуры с паркингом, вид сверху',
      },
      {
        name: 'Охрана и безопасность',
        description: 'Круглосуточная охрана территории, система контроля доступа, видеонаблюдение, пожарная сигнализация.',
        image: '/images/infrastructure/security.jpg',
        imageAlt: 'Система безопасности бизнес-центра',
      },
      {
        name: 'Ресепшн',
        description: 'Профессиональная служба ресепшн, помощь арендаторам и посетителям.',
        image: '/images/infrastructure/reception.jpg',
        imageAlt: 'Ресепшн бизнес-центра Фидель',
      },
      {
        name: 'Набережная Невы',
        description: 'Прогулочная зона на набережной Невы — уникальная особенность территории для отдыха сотрудников.',
        image: '/images/infrastructure/embankment.jpg',
        imageAlt: 'Набережная Невы рядом с бизнес-центром',
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
        answer: 'Открытый охраняемый паркинг на 500 мест. Парковочное место можно арендовать дополнительно. Также доступна крытая велопарковка на 50 мест.',
      },
    ],
    presentationUrl: '/documents/presentations/fidel-presentation.pdf',
    coordinates: { lat: 59.9075, lng: 30.4267 },
    order: 1,
  },
  {
    name: 'АБК',
    slug: 'anm',
    class: 'C',
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
      { value: 4, label: 'Этажей' },
      { value: '8 000', label: 'Общая площадь', unit: 'м²' },
      { value: 500, label: 'Машиномест' },
      { value: 'C', label: 'Класс' },
    ],
    description: 'Бизнес-центр на территории Александро-Невской Мануфактуры. Современные офисные помещения с качественной отделкой, удобная транспортная доступность и полная инфраструктура для бизнеса.',
    heroImage: '/images/buildings/anm/exterior-2.jpg',
    galleryImages: [
      '/images/buildings/anm/group-9.png',
      '/images/buildings/anm/abk-reception.jpg',
      '/images/buildings/anm/park-1.jpg',
      '/images/buildings/anm/sme-6510.png',
      '/images/buildings/anm/abk-cafe.jpg',
      '/images/buildings/anm/park-2.jpg',
    ],
    features: [
      {
        title: 'Расположение',
        description: 'Бизнес-центр расположен на территории исторической Александро-Невской Мануфактуры, в 5 минутах ходьбы от метро Елизаровская.',
        image: '/images/buildings/anm/exterior-1.jpg',
        imageAlt: 'Фасад бизнес-центра АБК',
      },
      {
        title: 'Современные офисы',
        description: 'Качественная отделка, современные инженерные системы, гибкие планировки для компаний любого размера.',
        image: '/images/buildings/anm/lobby.jpg',
        imageAlt: 'Холл бизнес-центра АБК',
      },
      {
        title: 'Паркинг',
        description: 'Просторный охраняемый паркинг на территории комплекса — удобный доступ для арендаторов и гостей.',
        image: '/images/common/territory-aerial.png',
        imageAlt: 'Территория Александро-Невской Мануфактуры с паркингом, вид сверху',
      },
    ],
    parameters: [
      { label: 'Класс', value: 'C' },
      { label: 'Этажей', value: '4' },
      { label: 'Общая площадь', value: '8 000 м²' },
      { label: 'Электроснабжение', value: 'II категория надежности' },
      { label: 'Кондиционирование', value: 'Централизованное' },
      { label: 'Вентиляция', value: 'Приточно-вытяжная' },
      { label: 'Паркинг', value: 'Охраняемый, 500 мест (общий)' },
    ],
    infrastructure: [
      {
        name: 'Ресепшн',
        description: 'Профессиональная служба ресепшн и просторный вестибюль для арендаторов и посетителей.',
        image: '/images/buildings/anm/reception.jpg',
        imageAlt: 'Ресепшн бизнес-центра АБК',
      },
      {
        name: 'Лифты',
        description: 'Современные лифты с просторными кабинами обеспечивают удобное перемещение между этажами.',
        image: '/images/buildings/anm/lift.jpg',
        imageAlt: 'Лифт бизнес-центра АБК',
      },
      {
        name: 'Охраняемый паркинг',
        description: 'Общий открытый охраняемый паркинг территории на 500 автомобилей с круглосуточным доступом.',
        image: '/images/buildings/anm/parking-2.jpg',
        imageAlt: 'Паркинг территории АБК',
      },
      {
        name: 'Кафе и столовая',
        description: 'Общая инфраструктура территории: кафе, столовая, банкоматы.',
        image: '/images/infrastructure/cafe.jpg',
        imageAlt: 'Кафе на территории АБК',
      },
    ],
    faq: [
      {
        question: 'Как связаться с коммерческим отделом?',
        answer: 'Позвоните по телефону +7 (812) 336-55-64 или напишите на mail@ukanm.ru.',
      },
    ],
    coordinates: { lat: 59.9078, lng: 30.4272 },
    order: 2,
  },
];

export function getBuildingBySlug(slug: string): Building | undefined {
  return buildings.find((b) => b.slug === slug);
}
