export const CATEGORIES = [
  {
    id: '1',
    name: 'Automobile',
    iconName: 'Car',
    subCategories: [
      {
        name: 'Cars',
        label: 'Brand',
        data: [
          { name: 'Maruti Suzuki', label: 'Model', data: ['Swift', 'Baleno', 'Brezza', 'Dzire', 'Ertiga', 'Wagon R', 'Alto K10', 'Grand Vitara', 'Fronx', 'Jimny', 'Ciaz', 'XL6', 'Ignis', 'Celerio', 'S-Presso', 'Invicto', 'Eeco', 'Other Model'] },
          { name: 'Hyundai', label: 'Model', data: ['Creta', 'Venue', 'i20', 'Grand i10 Nios', 'Verna', 'Aura', 'Exter', 'Alcazar', 'Tucson', 'Ioniq 5', 'Kona Electric', 'Santro', 'Xcent', 'Eon', 'Other Model'] },
          { name: 'Tata', label: 'Model', data: ['Nexon', 'Punch', 'Harrier', 'Safari', 'Tiago', 'Tigor', 'Altroz', 'Nexon EV', 'Tiago EV', 'Tigor EV', 'Punch EV', 'Curvv', 'Other Model'] },
          { name: 'Mahindra', label: 'Model', data: ['Thar', 'Scorpio N', 'Scorpio Classic', 'XUV700', 'XUV300', 'Bolero', 'Bolero Neo', 'XUV400', 'Marazzo', 'KUV100', 'Other Model'] },
          { name: 'Honda', label: 'Model', data: ['City', 'Amaze', 'Elevate', 'Jazz', 'WR-V', 'Civic', 'CR-V', 'Other Model'] },
          { name: 'Toyota', label: 'Model', data: ['Innova Crysta', 'Innova Hycross', 'Fortuner', 'Urban Cruiser Hyryder', 'Glanza', 'Rumion', 'Camry', 'Vellfire', 'Hilux', 'Other Model'] },
          { name: 'Kia', label: 'Model', data: ['Seltos', 'Sonet', 'Carens', 'Carnival', 'EV6', 'EV9', 'Other Model'] },
          { name: 'Volkswagen', label: 'Model', data: ['Virtus', 'Taigun', 'Tiguan', 'Polo', 'Vento', 'Other Model'] },
          { name: 'Skoda', label: 'Model', data: ['Slavia', 'Kushaq', 'Kodiaq', 'Superb', 'Octavia', 'Rapid', 'Other Model'] },
          { name: 'MG', label: 'Model', data: ['Hector', 'Hector Plus', 'Astor', 'Comet EV', 'ZS EV', 'Gloster', 'Other Model'] },
          { name: 'Ford', label: 'Model', data: ['EcoSport', 'Endeavour', 'Figo', 'Aspire', 'Freestyle', 'Other Model'] },
          { name: 'Renault', label: 'Model', data: ['Kwid', 'Triber', 'Kiger', 'Duster', 'Other Model'] },
          { name: 'Jeep', label: 'Model', data: ['Compass', 'Meridian', 'Wrangler', 'Grand Cherokee', 'Other Model'] },
          'BMW', 'Mercedes-Benz', 'Audi', 'Nissan', 'Citroen', 'Volvo', 'BYD', 'Lexus', 'Porsche', 'Land Rover', 'Jaguar', 'Mini', 'Isuzu', 'Force Motors', 'Mitsubishi', 'Fiat', 'Chevrolet', 'Datsun', 'Ambassador', 'Premier', 'Other Brands'
        ]
      },
      { name: 'Commercial Vehicles', label: 'Type', data: ['Trucks', 'Buses', 'Vans', 'Auto Rickshaws', 'Tempo Travelers', 'Loading Vehicles', 'Other'] },
      { name: 'Spare Parts & Accessories', label: 'Type', data: ['Car Parts', 'Car Stereos', 'Wheels & Tyres', 'Batteries', 'Seat Covers', 'Lighting', 'GPS & Navigation', 'Other Accessories'] }
    ]
  },
  {
    id: '2',
    name: 'Mobiles',
    iconName: 'Smartphone',
    subCategories: [
      {
        name: 'Mobile Phones',
        label: 'Brand',
        data: [
          { name: 'Apple', label: 'Model', data: ['iPhone 17 Pro Max','iPhone 17 Pro','iPhone 17 Plus','iPhone 17','iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16', 'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14', 'iPhone 13', 'iPhone 12', 'iPhone 11', 'iPhone SE', 'iPhone XR', 'iPhone XS', 'Other Model'] },
          { name: 'Samsung', label: 'Model', data: ['Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy S23 Ultra', 'Galaxy S23', 'Galaxy Z Fold5', 'Galaxy Z Flip5', 'Galaxy A55', 'Galaxy A35', 'Galaxy M55', 'Galaxy F55', 'Galaxy S21 FE', 'Galaxy A15', 'Galaxy A25', 'Other Model'] },
          { name: 'Vivo', label: 'Model', data: ['X100 Pro', 'X100', 'V30 Pro', 'V30', 'V29', 'T3 5G', 'T2 Pro', 'Y200', 'Y200e', 'Y17s', 'X90', 'V27', 'Other Model'] },
          { name: 'Oppo', label: 'Model', data: ['Reno 11 Pro', 'Reno 11', 'F25 Pro', 'F23', 'A79', 'A59', 'Find N3 Flip', 'Reno 10', 'A78', 'A58', 'Other Model'] },
          { name: 'Xiaomi', label: 'Model', data: ['Xiaomi 14 Ultra', 'Xiaomi 14', 'Redmi Note 13 Pro+', 'Redmi Note 13 Pro', 'Redmi Note 13', 'Redmi 13C', 'Xiaomi 13 Pro', 'Redmi 12 5G', 'Other Model'] },
          { name: 'Realme', label: 'Model', data: ['Realme 12 Pro+', 'Realme 12 Pro', 'Realme 12', 'Realme 11 Pro', 'Realme Narzo 70 Pro', 'Realme C67', 'Realme C53', 'Realme GT 2', 'Other Model'] },
          { name: 'OnePlus', label: 'Model', data: ['OnePlus 12', 'OnePlus 12R', 'OnePlus Open', 'OnePlus 11', 'OnePlus 11R', 'OnePlus Nord CE 4', 'OnePlus Nord 3', 'OnePlus Nord CE 3', 'Other Model'] },
          { name: 'Google Pixel', label: 'Model', data: ['Pixel 8 Pro', 'Pixel 8', 'Pixel 8a', 'Pixel 7 Pro', 'Pixel 7', 'Pixel 7a', 'Pixel 6a', 'Pixel Fold', 'Other Model'] },
          { name: 'Motorola', label: 'Model', data: ['Edge 50 Pro', 'Edge 40 Neo', 'G84', 'G54', 'Razr 40 Ultra', 'Razr 40', 'Other Model'] },
          { name: 'Nothing', label: 'Model', data: ['Phone (2a)', 'Phone (2)', 'Phone (1)', 'Other Model'] },
          'Infinix', 'Techno', 'Nokia', 'Asus', 'Poco', 'iQOO', 'Lava', 'Micromax', 'Honor', 'Huawei', 'Lenovo', 'Sony', 'LG', 'BlackBerry', 'HTC', 'Gionee', 'Meizu', 'Coolpad', 'Panasonic', 'Itel', 'Jio', 'Other Mobiles'
        ]
      },
      {
        name: 'Tablets',
        label: 'Brand',
        data: ['iPad', 'Samsung', 'Lenovo', 'Xiaomi', 'Realme', 'OnePlus', 'Motorola', 'Nokia', 'Huawei', 'Honor', 'Acer', 'Asus', 'TCL', 'Alcatel', 'Micromax', 'Lava', 'Other Tablets']
      },
      { name: 'Accessories', label: 'Type', data: ['Headphones', 'Earphones', 'TWS', 'Power Banks', 'Cases & Covers', 'Chargers', 'Cables', 'Screen Guards', 'Memory Cards', 'Mobile Holders', 'Selfie Sticks', 'Other Accessories'] },
      { name: 'Wearables', label: 'Type', data: ['Smart Watches', 'Fitness Bands', 'VR Headsets', 'Smart Glasses', 'Activity Trackers', 'Other'] }
    ]
  },
  {
    id: '3',
    name: 'Properties',
    iconName: 'Home',
    subCategories: [
      { name: 'For Sale: Houses & Apartments', label: 'Type', data: ['Apartments', 'Builder Floors', 'Farm Houses', 'Villas', 'Penthouses', 'Studio Apartments', 'Other'] },
      { name: 'For Rent: Houses & Apartments', label: 'Type', data: ['Apartments', 'Builder Floors', 'Farm Houses', 'Villas', 'Penthouses', 'Studio Apartments', 'Service Apartments', 'Other'] },
      { name: 'Lands & Plots', label: 'Type', data: ['For Sale', 'For Rent', 'Agricultural Land', 'Commercial Land', 'Industrial Land', 'Other'] },
      { name: 'Shops & Offices', label: 'Type', data: ['Shops', 'Offices', 'Showrooms', 'Warehouses', 'Co-working Space', 'Commercial Plots', 'Other'] },
      { name: 'PG & Guest Houses', label: 'Type', data: ['Guest Houses', 'Boys PG', 'Girls PG', 'Co-ed PG', 'Roommates', 'Other'] }
    ]
  },
  {
    id: '4',
    name: 'Electronics & Appliances',
    iconName: 'Tv',
    subCategories: [
      { name: 'TVs, Video - Audio', label: 'Type', data: ['Smart TVs', 'LED TVs', 'LCD TVs', 'Plasma TVs', 'CRT TVs', 'Home Theatre Systems', 'Bluetooth Speakers', 'Soundbars', 'Projectors', 'Streaming Devices', 'Amplifiers', 'Receivers', 'DVD Players', 'MP3 Players', 'Other'] },
      { name: 'Kitchen & Other Appliances', label: 'Type', data: ['Refrigerators', 'Washing Machines', 'Air Conditioners', 'Microwave Ovens', 'Water Purifiers', 'Air Purifiers', 'Vacuum Cleaners', 'Sewing Machines', 'Chimneys', 'Dishwashers', 'Geysers', 'Heaters', 'Fans', 'Coolers', 'Irons', 'Mixer Grinders', 'Juicers', 'Food Processors', 'Induction Cooktops', 'Other'] },
      { name: 'Computers & Laptops', label: 'Type', data: ['Laptops', 'Desktops', 'All-in-One PCs', 'Monitors', 'Printers', 'Scanners', 'Projectors', 'Servers', 'Other'] },
      { name: 'Cameras & Lenses', label: 'Type', data: ['DSLR Cameras', 'Mirrorless Cameras', 'Point & Shoot Cameras', 'Action Cameras', 'Drones', 'Camcorders', 'Camera Lenses', 'Tripods', 'Camera Bags', 'Binoculars', 'Telescopes', 'Other'] },
      { name: 'Games & Entertainment', label: 'Type', data: ['Gaming Consoles', 'Video Games', 'Gaming Accessories', 'Gaming PCs', 'VR Headsets', 'Other'] },
      { name: 'Computer Accessories', label: 'Type', data: ['Hard Disks', 'SSDs', 'Pen Drives', 'Routers', 'Modems', 'Keyboards', 'Mice', 'Webcams', 'Laptop Bags', 'Laptop Skins', 'Software', 'UPS', 'Other'] }
    ]
  },
  {
    id: '5',
    name: 'Furniture',
    iconName: 'Armchair',
    subCategories: [
      { name: 'Sofa & Dining', label: 'Type', data: ['Sofa Sets', 'Sofa Cum Beds', 'Recliners', 'L-Shaped Sofas', 'Dining Tables', 'Dining Chairs', 'Bean Bags', 'Rocking Chairs', 'Ottomans', 'Benches', 'Other'] },
      { name: 'Beds & Wardrobes', label: 'Type', data: ['Double Beds', 'Single Beds', 'Bunk Beds', 'Wardrobes', 'Cupboards', 'Mattresses', 'Dressing Tables', 'Bedside Tables', 'Trunks', 'Other'] },
      { name: 'Home Decor & Garden', label: 'Type', data: ['Curtains', 'Carpets', 'Rugs', 'Lighting', 'Lamps', 'Wall Decor', 'Paintings', 'Mirrors', 'Clocks', 'Vases', 'Plants', 'Pots', 'Garden Tools', 'Outdoor Seating', 'Swings', 'Water Fountains', 'Other'] },
      { name: 'Kids Furniture', label: 'Type', data: ['Kids Beds', 'Cribs', 'Bassinets', 'Kids Chairs', 'Study Tables', 'Kids Wardrobes', 'Toy Storage', 'Other'] },
      { name: 'Other Household Items', label: 'Type', data: ['Storage Boxes', 'Laundry Baskets', 'Shoe Racks', 'Book Shelves', 'Tools', 'Ladders', 'Others'] }
    ]
  },
  {
    id: '6',
    name: 'Fashion',
    iconName: 'Shirt',
    subCategories: [
      { name: 'Men', label: 'Category', data: ['T-Shirts', 'Shirts', 'Jeans', 'Trousers', 'Shorts', 'Track Pants', 'Suits', 'Blazers', 'Kurtas', 'Sherwanis', 'Jackets', 'Sweaters', 'Shoes', 'Sandals', 'Watches', 'Belts', 'Wallets', 'Sunglasses', 'Perfumes', 'Jewelry', 'Other'] },
      { name: 'Women', label: 'Category', data: ['Kurtis', 'Kurtas', 'Sarees', 'Lehengas', 'Dresses', 'Tops', 'T-Shirts', 'Jeans', 'Leggings', 'Palazzos', 'Skirts', 'Shorts', 'Jackets', 'Sweaters', 'Heels', 'Flats', 'Shoes', 'Sandals', 'Watches', 'Handbags', 'Jewelry', 'Sunglasses', 'Perfumes', 'Other'] },
      { name: 'Kids', label: 'Category', data: ['Boys Clothing', 'Girls Clothing', 'Infant Wear', 'Toys', 'School Supplies', 'Kids Footwear', 'Kids Accessories', 'Strollers', 'Walkers', 'Car Seats', 'Other'] }
    ]
  },
  {
    id: '7',
    name: 'Bikes',
    iconName: 'Bike',
    subCategories: [
      {
        name: 'Motorcycles',
        label: 'Brand',
        data: [
          { name: 'Royal Enfield', label: 'Model', data: ['Classic 350', 'Bullet 350', 'Hunter 350', 'Meteor 350', 'Himalayan 450', 'Continental GT 650', 'Interceptor 650', 'Super Meteor 650', 'Shotgun 650', 'Scram 411', 'Other Model'] },
          { name: 'Hero', label: 'Model', data: ['Splendor Plus', 'HF Deluxe', 'Passion Plus', 'Glamour', 'Super Splendor', 'Xtreme 125R', 'Xpulse 200 4V', 'Xpulse 200T', 'Karizma XMR', 'Mavrick 440', 'Pleasure Plus', 'Destini 125', 'Xoom', 'Other Model'] },
          { name: 'Honda', label: 'Model', data: ['Shine 125', 'SP 125', 'Unicorn', 'Hornet 2.0', 'CB200X', 'CB350', 'Hness CB350', 'CB300R', 'CB300F', 'Activa 6G', 'Activa 125', 'Dio', 'Other Model'] },
          { name: 'Bajaj', label: 'Model', data: ['Pulsar 150', 'Pulsar 125', 'Pulsar NS200', 'Pulsar N160', 'Platina 100', 'Platina 110', 'CT 110X', 'Avenger Cruise 220', 'Avenger Street 160', 'Dominar 400', 'Dominar 250', 'Chetak EV', 'Other Model'] },
          { name: 'TVS', label: 'Model', data: ['Apache RTR 160', 'Apache RTR 200 4V', 'Apache RR 310', 'Raider 125', 'Radeon', 'Sport', 'Star City Plus', 'Ronin', 'Jupiter', 'Ntorq 125', 'iQube EV', 'Other Model'] },
          { name: 'Yamaha', label: 'Model', data: ['MT 15 V2', 'R15 V4', 'FZ-S Fi V4', 'FZ-X', 'Aerox 155', 'RayZR 125', 'Fascino 125', 'Other Model'] },
          { name: 'KTM', label: 'Model', data: ['Duke 390', 'Duke 200', 'Duke 250', 'Duke 125', 'RC 390', 'RC 200', 'RC 125', 'Adventure 390', 'Adventure 250', 'Other Model'] },
          { name: 'Suzuki', label: 'Model', data: ['Access 125', 'Burgman Street', 'Avenis', 'Gixxer SF 250', 'Gixxer 250', 'Gixxer SF', 'Gixxer', 'V-Strom SX', 'Other Model'] },
          { name: 'Jawa', label: 'Model', data: ['Jawa 42', 'Jawa 42 Bobber', 'Jawa Perak', 'Jawa 350', 'Other Model'] },
          { name: 'Yezdi', label: 'Model', data: ['Roadster', 'Scrambler', 'Adventure', 'Other Model'] },
          'BMW', 'Triumph', 'Kawasaki', 'Harley Davidson', 'Ducati', 'Benelli', 'Husqvarna', 'Revolt', 'Ultraviolette', 'Tork', 'Komaki', 'Other Bikes'
        ]
      },
      {
        name: 'Scooters',
        label: 'Brand',
        data: [
          { name: 'Honda', label: 'Model', data: ['Activa 6G', 'Activa 125', 'Dio', 'Grazia', 'Other Model'] },
          { name: 'TVS', label: 'Model', data: ['Jupiter', 'Ntorq 125', 'Scooty Pep Plus', 'Zest 110', 'iQube Electric', 'Other Model'] },
          { name: 'Suzuki', label: 'Model', data: ['Access 125', 'Burgman Street', 'Avenis 125', 'Other Model'] },
          { name: 'Ola', label: 'Model', data: ['S1 Pro', 'S1 Air', 'S1 X', 'Other Model'] },
          { name: 'Ather', label: 'Model', data: ['450X', '450S', 'Rizta', 'Other Model'] },
          { name: 'Bajaj', label: 'Model', data: ['Chetak Premium', 'Chetak Urbane', 'Other Model'] },
          'Hero', 'Yamaha', 'Vespa', 'Aprilia', 'Okinawa', 'Ampere', 'Hero Electric', 'Pure EV', 'Simple Energy', 'River', 'Vida', 'Yulu', 'Other Scooters'
        ]
      },
      { name: 'Spare Parts', label: 'Type', data: ['Wheels', 'Tyres', 'Helmets', 'Jackets', 'Gloves', 'Lights', 'Silencers', 'Batteries', 'Other Parts'] },
      { name: 'Bicycles', label: 'Brand', data: ['Hercules', 'Hero', 'Btwin', 'Firefox', 'Atlas', 'Avon', 'Montra', 'Schnell', 'Ninety One', 'Urban Terrain', 'Other Brands'] }
    ]
  },
  {
    id: '8',
    name: 'Event Supplies',
    iconName: 'PartyPopper',
    subCategories: [
      { name: 'Furniture', label: 'Item', data: ['Banquet Tables', 'Round Tables', 'Cocktail Tables', 'Chiavari Chairs', 'Folding Chairs', 'Sofas', 'Bean Bags', 'Bar Stools', 'Other'] },
      { name: 'AV & Lighting', label: 'Item', data: ['Speakers', 'Microphones', 'Projectors', 'Screens', 'DJ Equipment', 'Focus Lights', 'Fairy Lights', 'Disco Lights', 'Generators', 'Other'] },
      { name: 'Decor', label: 'Item', data: ['Artificial Flowers', 'Vases', 'Carpets', 'Photo Booth Props', 'Table Cloths', 'Chair Covers', 'Stage Decor', 'Other'] },
      { name: 'Catering', label: 'Item', data: ['Chafing Dishes', 'Plates', 'Glasses', 'Cutlery', 'Serving Bowls', 'Water Dispensers', 'Other'] },
      { name: 'Tents & Cooling', label: 'Item', data: ['Canopies', 'Tents', 'Mist Fans', 'Air Coolers', 'Portable ACs', 'Other'] }
    ]
  },
  {
    id: '9',
    name: 'Medical',
    iconName: 'Stethoscope',
    subCategories: [
      { name: 'Respiratory', label: 'Item', data: ['Oxygen Concentrators 5L', 'Oxygen Concentrators 10L', 'Oxygen Cylinders', 'BiPAP Machines', 'CPAP Machines', 'Nebulizers', 'Suction Machines', 'Other'] },
      { name: 'Home Care', label: 'Item', data: ['Hospital Beds (Manual)', 'Hospital Beds (Electric)', 'Wheelchairs (Manual)', 'Wheelchairs (Electric)', 'Walkers', 'Crutches', 'Air Mattresses', 'Patient Monitors', 'IV Stands', 'Other'] },
      { name: 'Diagnostic', label: 'Item', data: ['Pulse Oximeters', 'BP Monitors', 'Thermometers', 'Glucometers', 'Weighing Scales', 'Other'] }
    ]
  },
  {
    id: '10',
    name: 'Travel & Camping',
    iconName: 'Tent',
    subCategories: [
      { name: 'Tents & Sleeping', label: 'Item', data: ['2-Person Tent', '4-Person Tent', '6-Person Tent', 'Sleeping Bags', 'Sleeping Mats', 'Air Pillows', 'Inflatable Mattresses', 'Other'] },
      { name: 'Gear', label: 'Item', data: ['Rucksacks 40L', 'Rucksacks 60L', 'Trekking Poles', 'Head Lamps', 'Torches', 'Binoculars', 'Portable Chairs', 'Camping Tables', 'Other'] },
      { name: 'Cooking', label: 'Item', data: ['Portable Stoves', 'Barbeque Grills', 'Camping Cookware', 'Cooler Boxes', 'Thermos Flasks', 'Other'] },
      { name: 'Action Cameras', label: 'Model', data: ['GoPro Hero 12', 'GoPro Hero 11', 'GoPro Hero 10', 'Insta360 X3', 'Insta360 Go 3', 'DJI Osmo Action', 'Accessories', 'Other'] }
    ]
  },
  {
    id: '11',
    name: 'Construction',
    iconName: 'Construction',
    subCategories: [
      { name: 'Tools', label: 'Item', data: ['Drill Machines', 'Angle Grinders', 'Tile Cutters', 'Marble Cutters', 'Heat Guns', 'Sanders', 'Saws', 'Other'] },
      { name: 'Heavy Equp.', label: 'Item', data: ['Concrete Mixers', 'Vibrators', 'Earth Rammers', 'Ladders', 'Scaffolding', 'Generators', 'Water Pumps', 'Welding Machines', 'Other'] },
      { name: 'Cleaning', label: 'Item', data: ['High Pressure Washers', 'Vacuum Cleaners', 'Floor Polishers', 'Other'] }
    ]
  },
  {
    id: '12',
    name: 'Instruments',
    iconName: 'Guitar', // Need to ensure Guitar is imported/mapped
    subCategories: [
      { name: 'Guitars', label: 'Type', data: ['Acoustic Guitar', 'Electric Guitar', 'Bass Guitar', 'Ukulele', 'Other'] },
      { name: 'Keys', label: 'Type', data: ['Keyboards', 'Synthesizers', 'Digital Pianos', 'Harmoniums', 'Other'] },
      { name: 'Percussion', label: 'Type', data: ['Drum Kits', 'Cajons', 'Tablas', 'Dholaks', 'Congas', 'Other'] },
      { name: 'Wind', label: 'Type', data: ['Flutes', 'Saxophones', 'Trumpets', 'Harmonicas', 'Other'] },
      { name: 'Studio Gear', label: 'Item', data: ['Microphones', 'Audio Interfaces', 'Studio Monitors', 'Headphones', 'Mixers', 'Other'] }
    ]
  },
  {
    id: '13',
    name: 'Services',
    iconName: 'Briefcase',
    subCategories: [
      { name: 'Electronics & Computer', label: 'Service', data: ['Computer Repair', 'Mobile Repair', 'Appliance Repair', 'Data Recovery', 'Other'] },
      { name: 'Education & Classes', label: 'Class', data: ['Tuitions', 'Competitive Exams', 'Music & Dance', 'Language Classes', 'Cooking Classes', 'Hobby Classes', 'Other'] },
      { name: 'Driver & Taxi', label: 'Service', data: ['Taxi Services', 'Driver for Hire', 'Car Rentals', 'Other'] },
      { name: 'Health & Beauty', label: 'Service', data: ['Salon at Home', 'Makeup Artists', 'Dieticians', 'Gym Trainers', 'Yoga Instructors', 'Other'] },
      { name: 'Other Services', label: 'Service', data: ['Plumbers', 'Electricians', 'Carpenters', 'Painters', 'Pest Control', 'Packers & Movers', 'Event Planners', 'Photography', 'Catering'] }
    ]
  }
];
