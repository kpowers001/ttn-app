-- Real partner photos on challenge cards. Path is relative to the web app
-- root; cards fall back to the trail gradient when photo is empty or the
-- file fails to load.

alter table challenges add column photo text not null default '';

update challenges set photo = 'photos/bb-barbecue.jpg' where title = 'Friday Night Flavors';
