-- UTCP ENTERPRISE DATABASE SCHEMA FOUNDATION
BEGIN;
CREATE SCHEMA IF NOT EXISTS iam;
CREATE SCHEMA IF NOT EXISTS crm;
CREATE SCHEMA IF NOT EXISTS product;
CREATE SCHEMA IF NOT EXISTS contracting;
CREATE SCHEMA IF NOT EXISTS search;
CREATE SCHEMA IF NOT EXISTS booking;
CREATE SCHEMA IF NOT EXISTS ops;
CREATE SCHEMA IF NOT EXISTS finance;
CREATE SCHEMA IF NOT EXISTS rooming;
CREATE SCHEMA IF NOT EXISTS tour;
CREATE SCHEMA IF NOT EXISTS charter;
CREATE SCHEMA IF NOT EXISTS b2b;
CREATE SCHEMA IF NOT EXISTS communication;
CREATE SCHEMA IF NOT EXISTS marketing;
CREATE SCHEMA IF NOT EXISTS ai;
CREATE SCHEMA IF NOT EXISTS cms;
CREATE SCHEMA IF NOT EXISTS regulatory;
CREATE SCHEMA IF NOT EXISTS treasury;
CREATE SCHEMA IF NOT EXISTS control;
CREATE SCHEMA IF NOT EXISTS integration;
CREATE SCHEMA IF NOT EXISTS reporting;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS iam.users (
 id BIGSERIAL PRIMARY KEY,
 email VARCHAR(255) NOT NULL UNIQUE,
 username VARCHAR(120) UNIQUE,
 password_hash TEXT NOT NULL,
 status_code VARCHAR(30) NOT NULL DEFAULT 'active',
 user_type_code VARCHAR(30) NOT NULL DEFAULT 'internal',
 is_internal BOOLEAN NOT NULL DEFAULT FALSE,
 is_b2b_user BOOLEAN NOT NULL DEFAULT FALSE,
 is_supplier_user BOOLEAN NOT NULL DEFAULT FALSE,
 last_login_at TIMESTAMP NULL,
 created_at TIMESTAMP NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
 deleted_at TIMESTAMP NULL
);
CREATE TABLE IF NOT EXISTS iam.user_profiles (
 id BIGSERIAL PRIMARY KEY,
 user_id BIGINT NOT NULL UNIQUE REFERENCES iam.users(id),
 first_name VARCHAR(120) NOT NULL,
 last_name VARCHAR(120) NOT NULL,
 display_name VARCHAR(255),
 phone VARCHAR(80),
 language_code VARCHAR(10),
 timezone VARCHAR(80),
 title VARCHAR(120),
 signature_html TEXT,
 created_at TIMESTAMP NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS iam.roles (
 id BIGSERIAL PRIMARY KEY,
 code VARCHAR(80) NOT NULL UNIQUE,
 name VARCHAR(120) NOT NULL,
 scope_code VARCHAR(30) NOT NULL,
 is_system BOOLEAN NOT NULL DEFAULT FALSE,
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS iam.permissions (
 id BIGSERIAL PRIMARY KEY,
 code VARCHAR(120) NOT NULL UNIQUE,
 module_code VARCHAR(80) NOT NULL,
 action_code VARCHAR(80) NOT NULL,
 description TEXT,
 created_at TIMESTAMP NOT NULL DEFAULT NOW(),
 UNIQUE(module_code, action_code)
);
CREATE TABLE IF NOT EXISTS iam.role_permissions (
 id BIGSERIAL PRIMARY KEY,
 role_id BIGINT NOT NULL REFERENCES iam.roles(id),
 permission_id BIGINT NOT NULL REFERENCES iam.permissions(id),
 created_at TIMESTAMP NOT NULL DEFAULT NOW(),
 UNIQUE(role_id, permission_id)
);
CREATE TABLE IF NOT EXISTS iam.user_roles (
 id BIGSERIAL PRIMARY KEY,
 user_id BIGINT NOT NULL REFERENCES iam.users(id),
 role_id BIGINT NOT NULL REFERENCES iam.roles(id),
 valid_from TIMESTAMP,
 valid_to TIMESTAMP,
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS iam.teams (
 id BIGSERIAL PRIMARY KEY,
 name VARCHAR(120) NOT NULL UNIQUE,
 team_type_code VARCHAR(30) NOT NULL,
 status_code VARCHAR(30) NOT NULL DEFAULT 'active',
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS iam.team_members (
 id BIGSERIAL PRIMARY KEY,
 team_id BIGINT NOT NULL REFERENCES iam.teams(id),
 user_id BIGINT NOT NULL REFERENCES iam.users(id),
 membership_role_code VARCHAR(30) NOT NULL DEFAULT 'member',
 is_primary BOOLEAN NOT NULL DEFAULT FALSE,
 created_at TIMESTAMP NOT NULL DEFAULT NOW(),
 UNIQUE(team_id, user_id)
);
CREATE TABLE IF NOT EXISTS iam.sessions (
 id BIGSERIAL PRIMARY KEY,
 user_id BIGINT NOT NULL REFERENCES iam.users(id),
 session_token_hash TEXT NOT NULL UNIQUE,
 ip_address VARCHAR(64),
 user_agent TEXT,
 started_at TIMESTAMP NOT NULL DEFAULT NOW(),
 expires_at TIMESTAMP NOT NULL,
 revoked_at TIMESTAMP
);
CREATE TABLE IF NOT EXISTS iam.api_clients (
 id BIGSERIAL PRIMARY KEY,
 name VARCHAR(255) NOT NULL,
 client_type_code VARCHAR(30) NOT NULL,
 owner_user_id BIGINT REFERENCES iam.users(id),
 status_code VARCHAR(30) NOT NULL DEFAULT 'active',
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS iam.api_client_keys (
 id BIGSERIAL PRIMARY KEY,
 api_client_id BIGINT NOT NULL REFERENCES iam.api_clients(id),
 key_hash TEXT NOT NULL UNIQUE,
 status_code VARCHAR(30) NOT NULL DEFAULT 'active',
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS iam.security_events (
 id BIGSERIAL PRIMARY KEY,
 user_id BIGINT REFERENCES iam.users(id),
 event_type_code VARCHAR(80) NOT NULL,
 severity_code VARCHAR(30) NOT NULL,
 ip_address VARCHAR(64),
 details_json JSONB,
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm.agencies (
 id BIGSERIAL PRIMARY KEY,
 agency_code VARCHAR(80) NOT NULL UNIQUE,
 legal_name VARCHAR(255) NOT NULL,
 commercial_name VARCHAR(255),
 primary_email VARCHAR(255),
 primary_phone VARCHAR(80),
 website_url VARCHAR(255),
 tax_number VARCHAR(80),
 registration_number VARCHAR(80),
 status_code VARCHAR(30) NOT NULL DEFAULT 'active',
 account_manager_user_id BIGINT REFERENCES iam.users(id),
 created_at TIMESTAMP NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS crm.contacts (
 id BIGSERIAL PRIMARY KEY,
 agency_id BIGINT REFERENCES crm.agencies(id),
 contact_type_code VARCHAR(30) NOT NULL,
 first_name VARCHAR(120) NOT NULL,
 last_name VARCHAR(120) NOT NULL,
 primary_email VARCHAR(255),
 primary_phone VARCHAR(80),
 status_code VARCHAR(30) NOT NULL DEFAULT 'active',
 language_code VARCHAR(10),
 country_code VARCHAR(10),
 owner_user_id BIGINT REFERENCES iam.users(id),
 created_at TIMESTAMP NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS crm.contact_profiles (
 id BIGSERIAL PRIMARY KEY,
 contact_id BIGINT NOT NULL UNIQUE REFERENCES crm.contacts(id),
 date_of_birth DATE,
 nationality_code VARCHAR(10),
 passport_number VARCHAR(100),
 passport_expiry_date DATE,
 gender_code VARCHAR(20),
 customer_segment_code VARCHAR(30),
 vip_level_code VARCHAR(30),
 notes_internal TEXT
);
CREATE TABLE IF NOT EXISTS crm.contact_marketing_consents (
 id BIGSERIAL PRIMARY KEY,
 contact_id BIGINT NOT NULL REFERENCES crm.contacts(id),
 channel_code VARCHAR(30) NOT NULL,
 consent_status_code VARCHAR(30) NOT NULL,
 consent_source_code VARCHAR(30),
 granted_at TIMESTAMP,
 revoked_at TIMESTAMP
);
CREATE TABLE IF NOT EXISTS crm.contact_travel_preferences (
 id BIGSERIAL PRIMARY KEY,
 contact_id BIGINT NOT NULL UNIQUE REFERENCES crm.contacts(id),
 preferred_airport_code VARCHAR(20),
 budget_min_amount NUMERIC(14,2),
 budget_max_amount NUMERIC(14,2),
 preferred_board_code VARCHAR(20),
 travel_style_code VARCHAR(30),
 direct_flights_only BOOLEAN NOT NULL DEFAULT FALSE,
 preferred_destinations_json JSONB,
 preferred_hotel_categories_json JSONB
);
CREATE TABLE IF NOT EXISTS crm.suppliers (
 id BIGSERIAL PRIMARY KEY,
 supplier_code VARCHAR(80) NOT NULL UNIQUE,
 legal_name VARCHAR(255) NOT NULL,
 supplier_type_code VARCHAR(30) NOT NULL,
 primary_email VARCHAR(255),
 primary_phone VARCHAR(80),
 status_code VARCHAR(30) NOT NULL DEFAULT 'active',
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS crm.supplier_profiles (
 id BIGSERIAL PRIMARY KEY,
 supplier_id BIGINT NOT NULL UNIQUE REFERENCES crm.suppliers(id),
 api_mode_code VARCHAR(30) NOT NULL DEFAULT 'manual',
 default_currency_code VARCHAR(10) DEFAULT 'EUR',
 response_time_sla_ms INTEGER,
 reliability_score NUMERIC(6,2),
 status_code VARCHAR(30) NOT NULL DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS product.destinations (
 id BIGSERIAL PRIMARY KEY,
 destination_code VARCHAR(80) NOT NULL UNIQUE,
 destination_type_code VARCHAR(30) NOT NULL,
 name VARCHAR(255) NOT NULL,
 slug VARCHAR(255) NOT NULL UNIQUE,
 parent_destination_id BIGINT REFERENCES product.destinations(id),
 country_code VARCHAR(10),
 latitude NUMERIC(10,7),
 longitude NUMERIC(10,7),
 status_code VARCHAR(30) NOT NULL DEFAULT 'active'
);
CREATE TABLE IF NOT EXISTS product.products (
 id BIGSERIAL PRIMARY KEY,
 product_type_code VARCHAR(30) NOT NULL,
 name VARCHAR(255) NOT NULL,
 destination_id BIGINT REFERENCES product.destinations(id),
 supplier_id BIGINT REFERENCES crm.suppliers(id),
 status_code VARCHAR(30) NOT NULL DEFAULT 'active',
 publication_status_code VARCHAR(30) NOT NULL DEFAULT 'draft',
 source_type_code VARCHAR(30) NOT NULL DEFAULT 'internal',
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS product.hotels (
 id BIGSERIAL PRIMARY KEY,
 product_id BIGINT NOT NULL UNIQUE REFERENCES product.products(id),
 stars INTEGER,
 city_name VARCHAR(120),
 country_code VARCHAR(10),
 latitude NUMERIC(10,7),
 longitude NUMERIC(10,7),
 check_in_time VARCHAR(20),
 check_out_time VARCHAR(20),
 hotel_chain_name VARCHAR(255),
 status_code VARCHAR(30) NOT NULL DEFAULT 'active'
);
CREATE TABLE IF NOT EXISTS product.hotel_room_types (
 id BIGSERIAL PRIMARY KEY,
 hotel_id BIGINT NOT NULL REFERENCES product.hotels(id),
 room_code VARCHAR(80) NOT NULL,
 name VARCHAR(255) NOT NULL,
 max_adults INTEGER NOT NULL DEFAULT 2,
 max_children INTEGER NOT NULL DEFAULT 0,
 max_infants INTEGER NOT NULL DEFAULT 0,
 base_occupancy_code VARCHAR(30),
 extra_bed_allowed BOOLEAN NOT NULL DEFAULT FALSE,
 baby_cot_allowed BOOLEAN NOT NULL DEFAULT FALSE,
 status_code VARCHAR(30) NOT NULL DEFAULT 'active',
 UNIQUE(hotel_id, room_code)
);
CREATE TABLE IF NOT EXISTS product.hotel_board_types (
 id BIGSERIAL PRIMARY KEY,
 hotel_id BIGINT NOT NULL REFERENCES product.hotels(id),
 board_code VARCHAR(20) NOT NULL,
 name VARCHAR(120) NOT NULL,
 is_default BOOLEAN NOT NULL DEFAULT FALSE,
 status_code VARCHAR(30) NOT NULL DEFAULT 'active',
 UNIQUE(hotel_id, board_code)
);
CREATE TABLE IF NOT EXISTS contracting.contracts (
 id BIGSERIAL PRIMARY KEY,
 contract_code VARCHAR(80) NOT NULL UNIQUE,
 contract_type_code VARCHAR(30) NOT NULL,
 supplier_id BIGINT NOT NULL REFERENCES crm.suppliers(id),
 product_id BIGINT REFERENCES product.products(id),
 start_date DATE NOT NULL,
 end_date DATE NOT NULL,
 currency_code VARCHAR(10) NOT NULL DEFAULT 'EUR',
 status_code VARCHAR(30) NOT NULL DEFAULT 'draft',
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS contracting.contract_versions (
 id BIGSERIAL PRIMARY KEY,
 contract_id BIGINT NOT NULL REFERENCES contracting.contracts(id),
 version_number INTEGER NOT NULL,
 effective_from DATE NOT NULL,
 effective_to DATE,
 is_current BOOLEAN NOT NULL DEFAULT FALSE,
 approval_status_code VARCHAR(30) NOT NULL DEFAULT 'draft',
 created_at TIMESTAMP NOT NULL DEFAULT NOW(),
 UNIQUE(contract_id, version_number)
);
CREATE TABLE IF NOT EXISTS contracting.contract_seasons (
 id BIGSERIAL PRIMARY KEY,
 contract_version_id BIGINT NOT NULL REFERENCES contracting.contract_versions(id),
 season_code VARCHAR(80) NOT NULL,
 name VARCHAR(255) NOT NULL,
 start_date DATE NOT NULL,
 end_date DATE NOT NULL,
 priority INTEGER NOT NULL DEFAULT 1,
 UNIQUE(contract_version_id, season_code)
);
CREATE TABLE IF NOT EXISTS contracting.rate_plans (
 id BIGSERIAL PRIMARY KEY,
 contract_version_id BIGINT NOT NULL REFERENCES contracting.contract_versions(id),
 rate_plan_code VARCHAR(80) NOT NULL,
 name VARCHAR(255) NOT NULL,
 pricing_basis_code VARCHAR(30) NOT NULL,
 status_code VARCHAR(30) NOT NULL DEFAULT 'active',
 UNIQUE(contract_version_id, rate_plan_code)
);
CREATE TABLE IF NOT EXISTS contracting.rate_plan_prices (
 id BIGSERIAL PRIMARY KEY,
 rate_plan_id BIGINT NOT NULL REFERENCES contracting.rate_plans(id),
 season_id BIGINT NOT NULL REFERENCES contracting.contract_seasons(id),
 room_type_id BIGINT REFERENCES product.hotel_room_types(id),
 board_type_id BIGINT REFERENCES product.hotel_board_types(id),
 occupancy_code VARCHAR(30) NOT NULL,
 price_amount NUMERIC(14,2) NOT NULL,
 currency_code VARCHAR(10) NOT NULL DEFAULT 'EUR',
 UNIQUE(rate_plan_id, season_id, room_type_id, board_type_id, occupancy_code)
);
CREATE TABLE IF NOT EXISTS contracting.allotments (
 id BIGSERIAL PRIMARY KEY,
 contract_version_id BIGINT NOT NULL REFERENCES contracting.contract_versions(id),
 hotel_id BIGINT NOT NULL REFERENCES product.hotels(id),
 room_type_id BIGINT REFERENCES product.hotel_room_types(id),
 board_type_id BIGINT REFERENCES product.hotel_board_types(id),
 start_date DATE NOT NULL,
 end_date DATE NOT NULL,
 release_days INTEGER NOT NULL DEFAULT 7,
 total_committed_qty INTEGER NOT NULL DEFAULT 0,
 status_code VARCHAR(30) NOT NULL DEFAULT 'active'
);
CREATE TABLE IF NOT EXISTS contracting.allotment_daily_inventory (
 id BIGSERIAL PRIMARY KEY,
 allotment_id BIGINT NOT NULL REFERENCES contracting.allotments(id),
 inventory_date DATE NOT NULL,
 committed_qty INTEGER NOT NULL DEFAULT 0,
 sold_qty INTEGER NOT NULL DEFAULT 0,
 blocked_qty INTEGER NOT NULL DEFAULT 0,
 free_qty INTEGER NOT NULL DEFAULT 0,
 UNIQUE(allotment_id, inventory_date)
);

CREATE TABLE IF NOT EXISTS search.search_requests (
 id BIGSERIAL PRIMARY KEY,
 user_id BIGINT REFERENCES iam.users(id),
 contact_id BIGINT REFERENCES crm.contacts(id),
 agency_id BIGINT REFERENCES crm.agencies(id),
 search_type_code VARCHAR(30) NOT NULL,
 origin_code VARCHAR(20),
 destination_code VARCHAR(80),
 start_date DATE NOT NULL,
 end_date DATE NOT NULL,
 currency_code VARCHAR(10) NOT NULL DEFAULT 'EUR',
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS search.offer_groups (
 id BIGSERIAL PRIMARY KEY,
 search_request_id BIGINT NOT NULL REFERENCES search.search_requests(id),
 group_type_code VARCHAR(30) NOT NULL,
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS search.offers (
 id BIGSERIAL PRIMARY KEY,
 offer_reference VARCHAR(80) NOT NULL UNIQUE,
 offer_group_id BIGINT NOT NULL REFERENCES search.offer_groups(id),
 offer_type_code VARCHAR(30) NOT NULL,
 status_code VARCHAR(30) NOT NULL DEFAULT 'active',
 source_mix_code VARCHAR(30) NOT NULL,
 total_sell_amount NUMERIC(14,2) NOT NULL,
 total_net_amount NUMERIC(14,2) NOT NULL,
 currency_code VARCHAR(10) NOT NULL DEFAULT 'EUR',
 expires_at TIMESTAMP NOT NULL,
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS search.offer_items (
 id BIGSERIAL PRIMARY KEY,
 offer_id BIGINT NOT NULL REFERENCES search.offers(id),
 item_type_code VARCHAR(30) NOT NULL,
 source_type_code VARCHAR(30) NOT NULL,
 source_ref_table VARCHAR(80),
 source_ref_id BIGINT,
 supplier_id BIGINT REFERENCES crm.suppliers(id),
 net_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
 sell_amount NUMERIC(14,2) NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS booking.bookings (
 id BIGSERIAL PRIMARY KEY,
 booking_reference VARCHAR(80) NOT NULL UNIQUE,
 booking_type_code VARCHAR(40) NOT NULL,
 user_id BIGINT REFERENCES iam.users(id),
 contact_id BIGINT REFERENCES crm.contacts(id),
 agency_id BIGINT REFERENCES crm.agencies(id),
 offer_id BIGINT REFERENCES search.offers(id),
 status_code VARCHAR(30) NOT NULL DEFAULT 'draft',
 currency_code VARCHAR(10) NOT NULL DEFAULT 'EUR',
 travel_start_date DATE,
 travel_end_date DATE,
 total_sell_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
 total_net_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
 created_at TIMESTAMP NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS booking.booking_items (
 id BIGSERIAL PRIMARY KEY,
 booking_id BIGINT NOT NULL REFERENCES booking.bookings(id),
 item_no INTEGER NOT NULL,
 item_type_code VARCHAR(40) NOT NULL,
 supplier_id BIGINT REFERENCES crm.suppliers(id),
 status_code VARCHAR(30) NOT NULL DEFAULT 'new',
 service_start_date DATE,
 service_end_date DATE,
 gross_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
 net_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
 UNIQUE(booking_id, item_no)
);
CREATE TABLE IF NOT EXISTS booking.booking_passengers (
 id BIGSERIAL PRIMARY KEY,
 booking_id BIGINT NOT NULL REFERENCES booking.bookings(id),
 passenger_no INTEGER NOT NULL,
 passenger_type_code VARCHAR(20) NOT NULL,
 first_name VARCHAR(120) NOT NULL,
 last_name VARCHAR(120) NOT NULL,
 date_of_birth DATE,
 passport_number VARCHAR(100),
 passport_expiry_date DATE,
 created_at TIMESTAMP NOT NULL DEFAULT NOW(),
 UNIQUE(booking_id, passenger_no)
);
CREATE TABLE IF NOT EXISTS booking.supplier_reservations (
 id BIGSERIAL PRIMARY KEY,
 booking_item_id BIGINT NOT NULL REFERENCES booking.booking_items(id),
 supplier_id BIGINT NOT NULL REFERENCES crm.suppliers(id),
 reservation_reference VARCHAR(255),
 supplier_status_code VARCHAR(30),
 request_payload_json JSONB,
 response_payload_json JSONB,
 requested_at TIMESTAMP NOT NULL DEFAULT NOW(),
 confirmed_at TIMESTAMP,
 status_code VARCHAR(30) NOT NULL DEFAULT 'requested'
);
CREATE TABLE IF NOT EXISTS booking.booking_documents (
 id BIGSERIAL PRIMARY KEY,
 booking_id BIGINT NOT NULL REFERENCES booking.bookings(id),
 booking_item_id BIGINT REFERENCES booking.booking_items(id),
 document_type_code VARCHAR(30) NOT NULL,
 file_key TEXT,
 generated_at TIMESTAMP NOT NULL DEFAULT NOW(),
 status_code VARCHAR(30) NOT NULL DEFAULT 'generated'
);

CREATE TABLE IF NOT EXISTS ops.reservation_workspaces (
 id BIGSERIAL PRIMARY KEY,
 booking_id BIGINT NOT NULL UNIQUE REFERENCES booking.bookings(id),
 assigned_user_id BIGINT REFERENCES iam.users(id),
 ops_status_code VARCHAR(30) NOT NULL DEFAULT 'new',
 priority_code VARCHAR(20) NOT NULL DEFAULT 'normal',
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS finance.payments (
 id BIGSERIAL PRIMARY KEY,
 booking_id BIGINT NOT NULL REFERENCES booking.bookings(id),
 payer_type_code VARCHAR(30) NOT NULL,
 amount NUMERIC(14,2) NOT NULL,
 currency_code VARCHAR(10) NOT NULL DEFAULT 'EUR',
 status_code VARCHAR(30) NOT NULL DEFAULT 'pending',
 paid_at TIMESTAMP,
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS finance.receivables (
 id BIGSERIAL PRIMARY KEY,
 booking_id BIGINT NOT NULL REFERENCES booking.bookings(id),
 amount NUMERIC(14,2) NOT NULL,
 currency_code VARCHAR(10) NOT NULL DEFAULT 'EUR',
 due_date DATE NOT NULL,
 status_code VARCHAR(30) NOT NULL DEFAULT 'open',
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS finance.payables (
 id BIGSERIAL PRIMARY KEY,
 booking_item_id BIGINT NOT NULL REFERENCES booking.booking_items(id),
 supplier_id BIGINT NOT NULL REFERENCES crm.suppliers(id),
 amount NUMERIC(14,2) NOT NULL,
 currency_code VARCHAR(10) NOT NULL DEFAULT 'EUR',
 due_date DATE NOT NULL,
 status_code VARCHAR(30) NOT NULL DEFAULT 'open',
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS rooming.rooming_sets (
 id BIGSERIAL PRIMARY KEY,
 booking_id BIGINT NOT NULL REFERENCES booking.bookings(id),
 rooming_type_code VARCHAR(30) NOT NULL,
 status_code VARCHAR(30) NOT NULL DEFAULT 'draft',
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS rooming.rooming_rooms (
 id BIGSERIAL PRIMARY KEY,
 rooming_set_id BIGINT NOT NULL REFERENCES rooming.rooming_sets(id),
 room_no INTEGER NOT NULL,
 occupancy_code VARCHAR(30),
 adults_count INTEGER NOT NULL DEFAULT 2,
 children_count INTEGER NOT NULL DEFAULT 0,
 room_status_code VARCHAR(30) NOT NULL DEFAULT 'draft'
);
CREATE TABLE IF NOT EXISTS tour.tour_programs (
 id BIGSERIAL PRIMARY KEY,
 product_id BIGINT NOT NULL UNIQUE REFERENCES product.products(id),
 program_code VARCHAR(80) NOT NULL UNIQUE,
 program_type_code VARCHAR(30) NOT NULL,
 duration_days INTEGER NOT NULL,
 duration_nights INTEGER NOT NULL,
 status_code VARCHAR(30) NOT NULL DEFAULT 'draft'
);
CREATE TABLE IF NOT EXISTS tour.tour_departures (
 id BIGSERIAL PRIMARY KEY,
 tour_program_id BIGINT NOT NULL REFERENCES tour.tour_programs(id),
 departure_code VARCHAR(80) NOT NULL UNIQUE,
 start_date DATE NOT NULL,
 end_date DATE NOT NULL,
 status_code VARCHAR(30) NOT NULL DEFAULT 'draft',
 min_pax INTEGER NOT NULL DEFAULT 0,
 max_pax INTEGER NOT NULL DEFAULT 0,
 sold_pax INTEGER NOT NULL DEFAULT 0,
 free_pax INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS charter.charter_seasons (
 id BIGSERIAL PRIMARY KEY,
 season_code VARCHAR(80) NOT NULL UNIQUE,
 name VARCHAR(255) NOT NULL,
 destination_id BIGINT NOT NULL REFERENCES product.destinations(id),
 origin_airport_code VARCHAR(20) NOT NULL,
 status_code VARCHAR(30) NOT NULL DEFAULT 'draft',
 season_start_date DATE NOT NULL,
 season_end_date DATE NOT NULL
);
CREATE TABLE IF NOT EXISTS charter.charter_flights (
 id BIGSERIAL PRIMARY KEY,
 charter_season_id BIGINT NOT NULL REFERENCES charter.charter_seasons(id),
 flight_date DATE NOT NULL,
 direction_code VARCHAR(20) NOT NULL,
 seat_capacity_total INTEGER NOT NULL DEFAULT 0,
 seat_capacity_sold INTEGER NOT NULL DEFAULT 0,
 seat_capacity_free INTEGER NOT NULL DEFAULT 0,
 status_code VARCHAR(30) NOT NULL DEFAULT 'scheduled'
);

CREATE TABLE IF NOT EXISTS b2b.agency_users (
 id BIGSERIAL PRIMARY KEY,
 agency_id BIGINT NOT NULL REFERENCES crm.agencies(id),
 user_id BIGINT NOT NULL REFERENCES iam.users(id),
 status_code VARCHAR(30) NOT NULL DEFAULT 'active',
 UNIQUE(agency_id, user_id)
);
CREATE TABLE IF NOT EXISTS communication.mailboxes (
 id BIGSERIAL PRIMARY KEY,
 mailbox_code VARCHAR(80) NOT NULL UNIQUE,
 name VARCHAR(255) NOT NULL,
 mailbox_type_code VARCHAR(30) NOT NULL,
 email_address VARCHAR(255) NOT NULL UNIQUE,
 status_code VARCHAR(30) NOT NULL DEFAULT 'active'
);
CREATE TABLE IF NOT EXISTS communication.mail_threads (
 id BIGSERIAL PRIMARY KEY,
 mailbox_id BIGINT NOT NULL REFERENCES communication.mailboxes(id),
 thread_key TEXT UNIQUE,
 status_code VARCHAR(30) NOT NULL DEFAULT 'new',
 assigned_user_id BIGINT REFERENCES iam.users(id),
 related_booking_id BIGINT REFERENCES booking.bookings(id),
 last_activity_at TIMESTAMP NOT NULL DEFAULT NOW(),
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS communication.mail_messages (
 id BIGSERIAL PRIMARY KEY,
 thread_id BIGINT NOT NULL REFERENCES communication.mail_threads(id),
 direction_code VARCHAR(30) NOT NULL,
 sender_user_id BIGINT REFERENCES iam.users(id),
 sender_email VARCHAR(255),
 subject TEXT,
 body_text TEXT,
 body_html TEXT,
 sent_at TIMESTAMP,
 received_at TIMESTAMP,
 status_code VARCHAR(30) NOT NULL DEFAULT 'received',
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS communication.outbound_quality_scores (
 id BIGSERIAL PRIMARY KEY,
 mail_message_id BIGINT NOT NULL UNIQUE REFERENCES communication.mail_messages(id),
 overall_score NUMERIC(6,2),
 tone_score NUMERIC(6,2),
 clarity_score NUMERIC(6,2),
 completeness_score NUMERIC(6,2),
 risk_score NUMERIC(6,2),
 scored_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS marketing.campaigns (
 id BIGSERIAL PRIMARY KEY,
 campaign_code VARCHAR(80) NOT NULL UNIQUE,
 campaign_type_code VARCHAR(30) NOT NULL,
 name VARCHAR(255) NOT NULL,
 owner_user_id BIGINT REFERENCES iam.users(id),
 status_code VARCHAR(30) NOT NULL DEFAULT 'draft',
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS marketing.audiences (
 id BIGSERIAL PRIMARY KEY,
 audience_code VARCHAR(80) NOT NULL UNIQUE,
 name VARCHAR(255) NOT NULL,
 audience_type_code VARCHAR(30) NOT NULL,
 refresh_mode_code VARCHAR(30) NOT NULL,
 status_code VARCHAR(30) NOT NULL DEFAULT 'active'
);
CREATE TABLE IF NOT EXISTS ai.ai_models (
 id BIGSERIAL PRIMARY KEY,
 model_code VARCHAR(80) NOT NULL UNIQUE,
 provider_code VARCHAR(80) NOT NULL,
 cost_tier_code VARCHAR(30) NOT NULL,
 status_code VARCHAR(30) NOT NULL DEFAULT 'active'
);
CREATE TABLE IF NOT EXISTS ai.ai_usage_logs (
 id BIGSERIAL PRIMARY KEY,
 model_id BIGINT REFERENCES ai.ai_models(id),
 task_type_code VARCHAR(80) NOT NULL,
 scope_type_code VARCHAR(30) NOT NULL,
 scope_ref_id BIGINT,
 user_id BIGINT REFERENCES iam.users(id),
 tokens_input INTEGER NOT NULL DEFAULT 0,
 tokens_output INTEGER NOT NULL DEFAULT 0,
 cost_amount NUMERIC(14,6),
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS cms.pages (
 id BIGSERIAL PRIMARY KEY,
 page_type_code VARCHAR(30) NOT NULL,
 entity_type_code VARCHAR(30),
 entity_id BIGINT,
 title VARCHAR(255) NOT NULL,
 slug VARCHAR(255) NOT NULL UNIQUE,
 status_code VARCHAR(30) NOT NULL DEFAULT 'draft',
 publication_status_code VARCHAR(30) NOT NULL DEFAULT 'draft',
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS cms.seo_metadata (
 id BIGSERIAL PRIMARY KEY,
 entity_type_code VARCHAR(30) NOT NULL,
 entity_id BIGINT NOT NULL,
 meta_title TEXT,
 meta_description TEXT,
 canonical_url TEXT,
 robots_index BOOLEAN NOT NULL DEFAULT TRUE,
 robots_follow BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS regulatory.sef_documents (
 id BIGSERIAL PRIMARY KEY,
 finance_document_id BIGINT,
 booking_id BIGINT REFERENCES booking.bookings(id),
 sef_document_reference VARCHAR(255),
 document_status_code VARCHAR(30) NOT NULL DEFAULT 'draft',
 request_payload_json JSONB,
 response_payload_json JSONB,
 sent_at TIMESTAMP,
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS regulatory.cis_trips (
 id BIGSERIAL PRIMARY KEY,
 booking_id BIGINT REFERENCES booking.bookings(id),
 trip_reference VARCHAR(255),
 submission_status_code VARCHAR(30) NOT NULL DEFAULT 'draft',
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS regulatory.fiscal_receipts (
 id BIGSERIAL PRIMARY KEY,
 booking_id BIGINT REFERENCES booking.bookings(id),
 payment_id BIGINT REFERENCES finance.payments(id),
 receipt_type_code VARCHAR(30) NOT NULL,
 fiscal_reference VARCHAR(255),
 qr_code_data TEXT,
 total_amount NUMERIC(14,2) NOT NULL,
 currency_code VARCHAR(10) NOT NULL DEFAULT 'RSD',
 status_code VARCHAR(30) NOT NULL DEFAULT 'queued',
 issued_at TIMESTAMP,
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS treasury.supplier_payment_orders (
 id BIGSERIAL PRIMARY KEY,
 payable_id BIGINT REFERENCES finance.payables(id),
 supplier_id BIGINT NOT NULL REFERENCES crm.suppliers(id),
 payment_channel_code VARCHAR(30) NOT NULL,
 amount NUMERIC(14,2) NOT NULL,
 currency_code VARCHAR(10) NOT NULL DEFAULT 'EUR',
 status_code VARCHAR(30) NOT NULL DEFAULT 'draft',
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS treasury.sepa_transfers (
 id BIGSERIAL PRIMARY KEY,
 supplier_payment_order_id BIGINT NOT NULL UNIQUE REFERENCES treasury.supplier_payment_orders(id),
 transfer_reference VARCHAR(255),
 status_code VARCHAR(30) NOT NULL DEFAULT 'queued',
 request_payload_json JSONB,
 response_payload_json JSONB,
 submitted_at TIMESTAMP
);
CREATE TABLE IF NOT EXISTS treasury.vcc_issuances (
 id BIGSERIAL PRIMARY KEY,
 supplier_payment_order_id BIGINT NOT NULL UNIQUE REFERENCES treasury.supplier_payment_orders(id),
 provider_reference VARCHAR(255),
 masked_card_no VARCHAR(40),
 limit_amount NUMERIC(14,2),
 currency_code VARCHAR(10) NOT NULL DEFAULT 'EUR',
 valid_from DATE,
 valid_to DATE,
 status_code VARCHAR(30) NOT NULL DEFAULT 'issued'
);
CREATE TABLE IF NOT EXISTS control.audit_logs (
 id BIGSERIAL PRIMARY KEY,
 entity_type_code VARCHAR(30) NOT NULL,
 entity_id BIGINT NOT NULL,
 action_code VARCHAR(30) NOT NULL,
 old_value_json JSONB,
 new_value_json JSONB,
 performed_by_user_id BIGINT REFERENCES iam.users(id),
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS control.queue_jobs (
 id BIGSERIAL PRIMARY KEY,
 queue_name VARCHAR(80) NOT NULL,
 job_type_code VARCHAR(80) NOT NULL,
 payload_json JSONB NOT NULL,
 status_code VARCHAR(30) NOT NULL DEFAULT 'queued',
 attempt_count INTEGER NOT NULL DEFAULT 0,
 available_at TIMESTAMP NOT NULL DEFAULT NOW(),
 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS control.event_bus_events (
 id BIGSERIAL PRIMARY KEY,
 event_code VARCHAR(120) NOT NULL,
 aggregate_type_code VARCHAR(30) NOT NULL,
 aggregate_id BIGINT NOT NULL,
 payload_json JSONB NOT NULL,
 published_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contacts_agency_id ON crm.contacts(agency_id);
CREATE INDEX IF NOT EXISTS idx_products_destination_id ON product.products(destination_id);
CREATE INDEX IF NOT EXISTS idx_contracts_supplier_id ON contracting.contracts(supplier_id);
CREATE INDEX IF NOT EXISTS idx_search_requests_created_at ON search.search_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_offers_expires_at ON search.offers(expires_at);
CREATE INDEX IF NOT EXISTS idx_bookings_contact_id ON booking.bookings(contact_id);
CREATE INDEX IF NOT EXISTS idx_bookings_agency_id ON booking.bookings(agency_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status_travel ON booking.bookings(status_code, travel_start_date);
CREATE INDEX IF NOT EXISTS idx_booking_items_booking_id ON booking.booking_items(booking_id);
CREATE INDEX IF NOT EXISTS idx_receivables_status_due ON finance.receivables(status_code, due_date);
CREATE INDEX IF NOT EXISTS idx_payables_status_due ON finance.payables(status_code, due_date);
CREATE INDEX IF NOT EXISTS idx_mail_threads_status_activity ON communication.mail_threads(status_code, last_activity_at);
CREATE INDEX IF NOT EXISTS idx_ai_usage_scope ON ai.ai_usage_logs(scope_type_code, scope_ref_id, created_at);
CREATE INDEX IF NOT EXISTS idx_queue_jobs_status_available ON control.queue_jobs(status_code, available_at);
COMMIT;

