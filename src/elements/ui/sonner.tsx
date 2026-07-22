import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="top-center"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          success:
            '!bg-green-50 !text-green-600 !border-green-200 dark:!bg-[#0c1912] dark:!text-emerald-400 dark:!border-emerald-500/20',
          error:
            '!bg-red-50 !text-red-600 !border-red-200 dark:!bg-[#1a0e0e] dark:!text-red-400 dark:!border-red-500/20',
          warning:
            '!bg-amber-50 !text-amber-600 !border-amber-200 dark:!bg-[#1a120b] dark:!text-amber-400 dark:!border-amber-500/20',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
