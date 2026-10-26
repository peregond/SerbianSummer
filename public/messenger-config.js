import {EPISODIC_AVATARS} from './episodic-cast.js?v=1';
// Shared presentation settings. Story text and consequences remain in the scenario.
export const MESSENGER_CONFIG = {
  accent: '#7360f2',
  title: 'Сообщения',
  historyLimit: 40,
  chrome: { light: '#f6f4f1', dark: '#19181c' },
  avatars: {
    ...EPISODIC_AVATARS,
    'Милица': 'milica.webp', 'Никола': 'nikola-friendly-buzz-v3.webp',
    'Драган': 'dragan-v2.webp', 'Йелена': 'jelena-v2.webp',
    'Ася': 'asya-friendly.webp', 'Лука': 'luka-reference-friendly-v3.webp',
    'Лазар': 'workshop/lazar-draft.webp', 'Теодора': 'workshop/teodora-draft.webp',
    'Ивана': 'workshop/ivana-draft.webp', 'Страхиня': 'workshop/strahinja-draft.webp',
    'Милош': 'workshop/milos-casual-friendly-draft.webp'
  }
};

// Legacy written replies that were authored as ordinary player lines.
// Indices are presentation overrides; do not insert or reorder story pages.
export const CHAT_SCENES = {
  evening_contact_plan: { contact: 'contact', pages: { 1: { direction: 'outgoing' } } },
  host_evening_invite: { contact: 'host', pages: { 0: { direction: 'outgoing' } } },
  room_rest: { contact: 'contact', pages: { 2: { direction: 'outgoing', quotedBody: true } } },
  housing_quiet: { contact: 'Ася', pages: { 0: { direction: 'outgoing' } } },
  housing_work: { contact: 'Ася', pages: { 0: { direction: 'outgoing' } } },
  housing_compare: { contact: 'Ася', pages: { 0: { direction: 'outgoing' } } },
  viewing_money: { contact: 'Ася', pages: { 0: { direction: 'outgoing' } } },
  viewing_documents: { contact: 'Ася', pages: { 0: { direction: 'outgoing' } } },
  viewing_life: { contact: 'Ася', pages: { 0: { direction: 'outgoing' } } }
};
