-- Real addresses, opening hours, and geocoded coordinates for pilot partners.
-- Coordinates geocoded via OSM Nominatim Jul 2026; hours from partner
-- listings (Yelp/NPS/Sweet Grown Alabama). Locations still awaiting partner
-- confirmation stay coords_verified = false.

alter table locations add column address text not null default '';
alter table locations add column hours text not null default '';

update locations set
  address = '405 Fonville St, Tuskegee, AL 36083',
  hours   = 'Wed–Sat 11 AM–12 AM · Sun 11 AM–8 PM',
  lat = 32.42516, lng = -85.69637, coords_verified = true
where id = 'bb-barbecue';

update locations set
  address = '2801 W Martin Luther King Hwy, Tuskegee, AL 36083',
  hours   = 'Mon–Tue 11 AM–4 PM · Wed–Sat 11 AM–9 PM · Sun 2–9 PM',
  lat = 32.40556, lng = -85.71881, coords_verified = true
where id = 'house-of-stewarts';

update locations set
  address = '1616 Chappie James Ave, Tuskegee, AL 36083 (Moton Field)',
  hours   = 'Wed–Sat 9 AM–4:30 PM · Free admission',
  lat = 32.45710, lng = -85.67984, coords_verified = true
where id = 'airmen-museum';

update locations set
  address = '1212 W Montgomery Rd, Tuskegee, AL 36088',
  hours   = 'Mon–Sat 9 AM–4:30 PM · Campus pass required',
  lat = 32.42887, lng = -85.70844, coords_verified = true
where id = 'carver-museum';

update locations set
  address = '1200 W Montgomery Rd, Kenney Hall, TU campus',
  hours   = 'Call ahead · Campus pass required',
  lat = 32.43011, lng = -85.70673, coords_verified = false
where id = 'legacy-museum';

update locations set
  address = 'Elm St & Spring St, downtown Tuskegee',
  hours   = 'Wed & Sat 8 AM–2 PM · May–Sep',
  lat = 32.42430, lng = -85.69130, coords_verified = false
where id = 'farmers-market';

update locations set
  address = '690 County Road 81, Tuskegee, AL 36083',
  hours   = 'Mon–Sat 8 AM–12 PM & 5–7 PM · Late May–late Jul · Cash only',
  coords_verified = false
where id = 'shady-grove';

update locations set
  address = 'Find their stand at the Farmers Market',
  hours   = 'Market days: Wed & Sat 8 AM–2 PM',
  coords_verified = false
where id = 'tuskegee-honey';

update locations set
  address = 'Address TBD — confirming with owner',
  hours   = 'Private tours by appointment',
  coords_verified = false
where id = 'the-shed';
