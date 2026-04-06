import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveToDocuments } from '../lib/saveDocument';

/**
 * Wraps saveToDocuments with auth check.
 * If not logged in, redirects to /pricing with returnTo param.
 * Returns false if redirected, true if saved successfully.
 */
export function useSaveToDocuments() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    return async (
        title: string,
        type: string,
        icon: string,
        data: Record<string, unknown>
    ): Promise<boolean> => {
        if (!user) {
            const tool = searchParams.get('tool') || '';
            const returnTo = tool ? `/tools?tool=${tool}` : '/tools';
            navigate(`/pricing?returnTo=${encodeURIComponent(returnTo)}`);
            return false;
        }
        await saveToDocuments(title, type, icon, data);
        return true;
    };
}
