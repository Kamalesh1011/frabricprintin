export interface FabricFilters {
  category: string;
  usages: string[];
  patterns: string[];
  colors: string[];
  weaves: string[];
  properties: string[];
  gsmRange: string;
  minPrice: number;
  maxPrice: number;
  search: string;
  sort: string;
  viewMode: 'grid' | 'table';
  page: number;
}

export const DEFAULT_FABRIC_FILTERS: FabricFilters = {
  category: 'All',
  usages: [],
  patterns: [],
  colors: [],
  weaves: [],
  properties: [],
  gsmRange: 'All',
  minPrice: 0,
  maxPrice: 1500,
  search: '',
  sort: 'featured',
  viewMode: 'grid',
  page: 1
};

/**
 * Parses URL search params or hash query into structured FabricFilters
 */
export function parseFiltersFromUrl(): Partial<FabricFilters> {
  if (typeof window === 'undefined') return {};

  try {
    const searchString = window.location.search || '';
    const hashString = window.location.hash.includes('?') 
      ? window.location.hash.substring(window.location.hash.indexOf('?')) 
      : '';
    
    const params = new URLSearchParams(searchString || hashString);
    const filters: Partial<FabricFilters> = {};

    if (params.get('type') || params.get('category')) {
      filters.category = params.get('type') || params.get('category') || 'All';
    }

    if (params.get('usages')) {
      filters.usages = params.get('usages')!.split(',').filter(Boolean);
    }

    if (params.get('patterns') || params.get('pattern')) {
      filters.patterns = (params.get('patterns') || params.get('pattern'))!.split(',').filter(Boolean);
    }

    if (params.get('colors') || params.get('color')) {
      filters.colors = (params.get('colors') || params.get('color'))!.split(',').filter(Boolean);
    }

    if (params.get('weaves') || params.get('weave')) {
      filters.weaves = (params.get('weaves') || params.get('weave'))!.split(',').filter(Boolean);
    }

    if (params.get('properties')) {
      filters.properties = params.get('properties')!.split(',').filter(Boolean);
    }

    if (params.get('gsm')) {
      filters.gsmRange = params.get('gsm')!;
    }

    if (params.get('minPrice')) {
      filters.minPrice = Number(params.get('minPrice')) || 0;
    }

    if (params.get('maxPrice')) {
      filters.maxPrice = Number(params.get('maxPrice')) || 1500;
    }

    if (params.get('q') || params.get('search')) {
      filters.search = params.get('q') || params.get('search') || '';
    }

    if (params.get('sort')) {
      filters.sort = params.get('sort')!;
    }

    if (params.get('view')) {
      filters.viewMode = params.get('view') === 'table' ? 'table' : 'grid';
    }

    if (params.get('page')) {
      filters.page = Math.max(1, Number(params.get('page')) || 1);
    }

    return filters;
  } catch (err) {
    console.error('Failed to parse filters from URL:', err);
    return {};
  }
}

/**
 * Serializes filters to URL query string and syncs to browser address bar
 */
export function syncFiltersToUrl(filters: FabricFilters, currentTab = 'fabrics') {
  if (typeof window === 'undefined') return;

  try {
    const params = new URLSearchParams();

    if (filters.category && filters.category !== 'All') {
      params.set('type', filters.category);
    }

    if (filters.usages && filters.usages.length > 0) {
      params.set('usages', filters.usages.join(','));
    }

    if (filters.patterns && filters.patterns.length > 0) {
      params.set('pattern', filters.patterns.join(','));
    }

    if (filters.colors && filters.colors.length > 0) {
      params.set('color', filters.colors.join(','));
    }

    if (filters.weaves && filters.weaves.length > 0) {
      params.set('weave', filters.weaves.join(','));
    }

    if (filters.properties && filters.properties.length > 0) {
      params.set('properties', filters.properties.join(','));
    }

    if (filters.gsmRange && filters.gsmRange !== 'All') {
      params.set('gsm', filters.gsmRange);
    }

    if (filters.minPrice > 0) {
      params.set('minPrice', filters.minPrice.toString());
    }

    if (filters.maxPrice < 1500) {
      params.set('maxPrice', filters.maxPrice.toString());
    }

    if (filters.search && filters.search.trim()) {
      params.set('q', filters.search.trim());
    }

    if (filters.sort && filters.sort !== 'featured') {
      params.set('sort', filters.sort);
    }

    if (filters.viewMode && filters.viewMode !== 'grid') {
      params.set('view', filters.viewMode);
    }

    if (filters.page && filters.page > 1) {
      params.set('page', filters.page.toString());
    }

    const queryString = params.toString();
    const newHash = queryString ? `#${currentTab}?${queryString}` : `#${currentTab}`;

    if (window.location.hash !== newHash) {
      window.history.replaceState({ ...window.history.state, filters }, '', newHash);
    }
  } catch (err) {
    console.error('Failed to sync filters to URL:', err);
  }
}
