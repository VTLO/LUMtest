/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TabType = 
  | 'dashboard'
  | 'crm'
  | 'site'
  | 'emails'
  | 'automations'
  | 'sales'
  | 'resources'
  | 'forms'
  | 'lexicon'
  | 'privacy'
  | 'settings';

export type SubTabType =
  | 'contacts' | 'tags' | 'pipelines' | 'calendar'
  | 'website' | 'funnels' | 'creator_page' | 'blogs'
  | 'newsletters' | 'campaigns' | 'statistics'
  | 'physical_products' | 'promo_codes' | 'courses' | 'communities' | 'files'
  | 'orders' | 'transactions' | 'subscriptions'
  | 'rules' | 'workflows';

export interface LexiconEntry {
  title: string;
  description: string;
}

export interface FormQuestion {
  id: string;
  type: 'short_text' | 'long_text' | 'multiple_choice' | 'checkbox' | 'video' | 'image' | 'poll' | 'email' | 'custom';
  title: string;
  description?: string;
  required: boolean;
  options?: string[];
  mediaUrl?: string; 
  results?: Record<string, number>; // Mock results for visualization
}

export interface FormTemplate {
  id: string;
  title: string;
  description: string;
  questions: FormQuestion[];
}

export interface Form {
  id: string;
  title: string;
  description: string;
  questions: FormQuestion[];
  responses: any[];
  settings: FormSettings;
  status: 'draft' | 'published';
}

export interface FormSettings {
  collectEmails: boolean;
  limitToOneResponse: boolean;
  showProgressBar: boolean;
}
