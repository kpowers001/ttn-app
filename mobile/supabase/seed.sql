-- Pilot seed data. Coordinates are PLACEHOLDERS (coords_verified = false) —
-- replace with geocoded values from Google Maps before the pilot (LOCATIONS.md).

insert into trails (id, name, icon, color, sort_order) values
  ('food',    'Food Trail',           '🍽️', '#D44000', 1),
  ('history', 'History Trail',        '🏛️', '#8B1A1A', 2),
  ('farm',    'Farm & Nature Trail',  '🌾', '#2E7D32', 3),
  ('arts',    'Arts & Culture Trail', '🎨', '#6A1B9A', 4);

insert into locations (id, trail_id, name, description, lat, lng, radius_m, points, coords_verified) values
  ('bb-barbecue',       'food',    'B&B Barbecue',                'Local barbecue · 405 Fonville St',              32.4310, -85.6960,  60, 50, false),
  ('house-of-stewarts', 'food',    'The New House of Stewarts',   'Restaurant & event venue · 2801 W MLK Hwy',     32.4222, -85.7360,  80, 50, false),
  ('airmen-museum',     'history', 'Tuskegee Airmen Museum',      'National Historic Site at Moton Field',         32.4557, -85.6785, 120, 75, false),
  ('carver-museum',     'history', 'G.W. Carver Museum',          'Science & legacy · Tuskegee Institute NHS',     32.4287, -85.7062, 100, 75, false),
  ('legacy-museum',     'arts',    'Legacy Museum',               'University art collections & bioethics',        32.4300, -85.7078, 100, 65, false),
  ('farmers-market',    'farm',    'Macon County Farmers Market', 'Local produce · Elm & Spring St · Wed & Sat',   32.4247, -85.6905,  60, 60, false),
  ('shady-grove',       'farm',    'Shady Grove Blueberry Patch', 'U-pick blueberries · 690 County Rd 81',         32.3900, -85.6400, 150, 60, false),
  ('tuskegee-honey',    'farm',    'Tuskegee Honey',              'Raw wildflower honey from local hives',         32.4200, -85.6800, 100, 60, false),
  ('the-shed',          'farm',    'The Shed (Reptile House)',    'Reptile education & conservation',              32.4400, -85.6600, 100, 60, false);

insert into badges (id, name, icon, rule_key) values
  ('pioneer',        'Pioneer',        '👣', 'first_visit'),
  ('food-explorer',  'Food Explorer',  '🍽️', 'complete_trail:food'),
  ('historian',      'Historian',      '🏛️', 'complete_trail:history'),
  ('farm-fresh',     'Farm Fresh',     '🌾', 'complete_trail:farm'),
  ('art-lover',      'Art Lover',      '🎨', 'complete_trail:arts'),
  ('grand-explorer', 'Grand Explorer', '🗺️', 'complete_all_trails'),
  ('challenge-king', 'Challenge King', '🔥', 'complete_challenges:3'),
  ('social-tiger',   'Social Tiger',   '👥', 'reserved_post_pilot');

insert into rewards (id, name, partner, cost_points, icon) values
  ('bookstore-20',  'Bookstore Discount (20%)', 'TU Bookstore',   500, '📚'),
  ('campus-meal',   'Free Campus Meal',         'Tiger Dining',   300, '🍽️'),
  ('bbq-plate',     'BBQ Plate',                'B&B Barbecue',   800, '🍖'),
  ('honey-jar',     'Local Honey Jar',          'Tuskegee Honey', 700, '🍯');

-- Sample pilot challenges (adjust dates before the event)
insert into challenges (title, business_name, location_id, trail_id, bonus_points, icon, badge_icon, starts_at, ends_at) values
  ('Friday Night Flavors',     'B&B Barbecue',                'bb-barbecue',    'food',    150, '🍖', '🔥', now(),                  now() + interval '3 days'),
  ('Market Morning Run',       'Macon County Farmers Market', 'farmers-market', 'farm',    200, '🥗', '🌱', now(),                  now() + interval '5 days'),
  ('Meet the Reptiles',        'The Shed',                    'the-shed',       'farm',    175, '🦎', '🐍', now(),                  now() + interval '2 days'),
  ('Airmen History Day',       'Tuskegee Airmen Museum',      'airmen-museum',  'history', 250, '✈️', '📚', now() + interval '5 days', now() + interval '9 days'),
  ('Blueberry Season Finale',  'Shady Grove Blueberry Patch', 'shady-grove',    'farm',    300, '🫐', '🏆', now() + interval '7 days', now() + interval '10 days');
