'use client'
//@ts-nocheck
import { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';
import ModuleDetail from '@/components/modules/ModuleDetail';
import { useSideNav } from '@/contexts/sideNav-context';

export default function ModuleDetailCatchAllPage() {
  const params = useParams();
  const part = params.part as string[] | undefined;
  const moduleId = useMemo(() => (Array.isArray(part) ? part.join('/') : ''), [part]);
  const { isCollapsed, setCollapsed } = useSideNav();
  const prevCollapsedRef = useRef<boolean>(isCollapsed);

  useEffect(() => {
    prevCollapsedRef.current = isCollapsed;
    setCollapsed(true);
    return () => setCollapsed(prevCollapsedRef.current);
  }, []);

  if (!moduleId) return null;
  return <ModuleDetail moduleId={moduleId} />;
}

