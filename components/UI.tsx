
import React from 'react';

// Reusable Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  size = 'md', 
  icon, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-black uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-indigo-600 text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300",
    secondary: "bg-slate-900 text-white shadow-xl shadow-slate-200 hover:bg-slate-800",
    outline: "bg-white border-2 border-slate-100 text-slate-700 hover:border-indigo-600 hover:text-indigo-600",
    danger: "bg-red-50 text-red-600 border-2 border-red-100 hover:bg-red-600 hover:text-white",
    ghost: "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px] rounded-xl",
    md: "px-6 py-3 text-xs rounded-2xl",
    lg: "px-10 py-5 text-sm rounded-[2rem]",
    xl: "px-12 py-6 text-xl rounded-[2.5rem]"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};

// Reusable Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, containerClassName = '', ...props }) => {
  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">{label}</label>}
      <input 
        className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all font-bold placeholder:text-slate-300 ${
          error ? 'border-red-200 bg-red-50 focus:border-red-500' : 'border-slate-100 bg-slate-50/50 focus:border-indigo-600 focus:bg-white'
        }`}
        {...props}
      />
      {error && <p className="text-[10px] font-bold text-red-500 ml-2">{error}</p>}
    </div>
  );
};

// Reusable DataTable Component
interface DataTableProps<T> {
  columns: {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
    align?: 'left' | 'right' | 'center';
  }[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export function DataTable<T>({ columns, data, onRowClick, emptyMessage = "No data available" }: DataTableProps<T>) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden relative">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/80 backdrop-blur-md border-b">
          <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
            {columns.map((col, idx) => (
              <th key={idx} className={`px-10 py-6 ${col.className} ${col.align === 'right' ? 'text-right' : ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.length > 0 ? data.map((item, rowIdx) => (
            <tr 
              key={rowIdx} 
              onClick={() => onRowClick?.(item)} 
              className={`${onRowClick ? 'cursor-pointer hover:bg-indigo-50/30' : ''} transition-all group`}
            >
              {columns.map((col, colIdx) => (
                <td key={colIdx} className={`px-10 py-6 ${col.className} ${col.align === 'right' ? 'text-right' : ''}`}>
                  {typeof col.accessor === 'function' ? col.accessor(item) : (item[col.accessor] as React.ReactNode)}
                </td>
              ))}
            </tr>
          )) : (
            <tr>
              <td colSpan={columns.length} className="p-32 text-center">
                <div className="text-6xl mb-6 grayscale opacity-20">📂</div>
                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">{emptyMessage}</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Reusable Card Component
export const Card: React.FC<{ children: React.ReactNode; className?: string; padded?: boolean }> = ({ 
  children, 
  className = '', 
  padded = true 
}) => (
  <div className={`bg-white rounded-[3rem] border border-slate-200 shadow-sm transition-all hover:shadow-md ${padded ? 'p-10' : ''} ${className}`}>
    {children}
  </div>
);
