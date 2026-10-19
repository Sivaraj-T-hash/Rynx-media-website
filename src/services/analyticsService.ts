import { supabase } from '../lib/supabase';

export interface AnalyticsSummary {
  publishedProjectsCount: number;
  totalProjectsCount: number;
  categoriesCount: number;
  publishedTestimonialsCount: number;
  totalEnquiriesCount: number;
  newEnquiriesCount: number;
  contactedEnquiriesCount: number;
  inProgressEnquiriesCount: number;
  closedEnquiriesCount: number;
  publishedBeforeAfterCount: number;
  totalEventsLogged: number;
}

export const analyticsService = {
  async logEvent(eventName: string, metadata: Record<string, unknown> = {}): Promise<void> {
    try {
      await supabase.from('analytics_events').insert({
        event_name: eventName,
        metadata,
      });
    } catch {
      // Non-blocking telemetry
    }
  },

  async getSummary(): Promise<AnalyticsSummary> {
    try {
      const [
        projectsRes,
        allProjectsRes,
        categoriesRes,
        testimonialsRes,
        enquiriesRes,
        beforeAfterRes,
        eventsRes,
      ] = await Promise.all([
        supabase.from('portfolio_projects').select('id', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('portfolio_projects').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('testimonials').select('id', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('enquiries').select('id, status'),
        supabase.from('before_after_projects').select('id', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('analytics_events').select('id', { count: 'exact', head: true }),
      ]);

      const enquiriesData = enquiriesRes.data || [];
      const totalEnquiries = enquiriesData.length;
      const newEnquiries = enquiriesData.filter((e) => e.status === 'New').length;
      const contactedEnquiries = enquiriesData.filter((e) => e.status === 'Contacted').length;
      const inProgressEnquiries = enquiriesData.filter((e) => e.status === 'In Progress').length;
      const closedEnquiries = enquiriesData.filter((e) => e.status === 'Closed').length;

      return {
        publishedProjectsCount: projectsRes.count || 0,
        totalProjectsCount: allProjectsRes.count || 0,
        categoriesCount: categoriesRes.count || 0,
        publishedTestimonialsCount: testimonialsRes.count || 0,
        totalEnquiriesCount: totalEnquiries,
        newEnquiriesCount: newEnquiries,
        contactedEnquiriesCount: contactedEnquiries,
        inProgressEnquiriesCount: inProgressEnquiries,
        closedEnquiriesCount: closedEnquiries,
        publishedBeforeAfterCount: beforeAfterRes.count || 0,
        totalEventsLogged: eventsRes.count || 0,
      };
    } catch (err) {
      console.warn('Error fetching analytics summary:', err);
      return {
        publishedProjectsCount: 0,
        totalProjectsCount: 0,
        categoriesCount: 0,
        publishedTestimonialsCount: 0,
        totalEnquiriesCount: 0,
        newEnquiriesCount: 0,
        contactedEnquiriesCount: 0,
        inProgressEnquiriesCount: 0,
        closedEnquiriesCount: 0,
        publishedBeforeAfterCount: 0,
        totalEventsLogged: 0,
      };
    }
  },
};
