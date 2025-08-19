'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumb() {
  const pathname = usePathname();
  
  // Don't show breadcrumb on home page
  if (pathname === '/') return null;
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ];
    
    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Customize labels for better UX
      let label = segment;
      if (segment === 'blog') label = 'Blog';
      if (segment === 'portfolio') label = 'Portfolio';
      if (segment === 'create') label = 'Create Post';
      if (segment === 'edit') label = 'Edit Post';
      
      // For dynamic segments, use the actual segment value
      if (segments[index - 1] === 'portfolio' || segments[index - 1] === 'blog') {
        label = decodeURIComponent(segment);
      }
      
      breadcrumbs.push({
        label: label.charAt(0).toUpperCase() + label.slice(1),
        href: currentPath
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index === 0 && (
            <Home className="w-4 h-4 mr-1" />
          )}
          
          {index < breadcrumbs.length - 1 ? (
            <>
              <Link 
                href={item.href} 
                className="hover:text-blue-600 transition-colors duration-200"
              >
                {item.label}
              </Link>
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            </>
          ) : (
            <span className="text-gray-900 font-medium" aria-current="page">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
