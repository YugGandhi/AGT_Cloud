import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { productCategories } from "@/lib/constants";

export function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={menuRef}
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="nav-link flex items-center font-medium text-gray-800 hover:text-primary transition duration-300 cursor-pointer relative group">
        Products{" "}
        <ChevronDown
          className={`ml-1 h-4 w-4 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute left-1/2 -translate-x-1/2 mt-0 w-[1200px] bg-white shadow-xl rounded-lg p-0 z-50 ml-[-400px] overflow-hidden"
          >
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 rounded-full -ml-10 -mb-10"></div>

              <div
                className="flex flex-row justify-between relative z-10 min-w-0 w-full"
                style={{ whiteSpace: "nowrap" }}
              >
                {productCategories.map((category) => (
                  <div
                    key={category.slug}
                    className="min-w-[220px] p-4 hover:bg-gray-50 transition-colors duration-300 group/category flex-shrink-0"
                  >
                    <Link
                      href={`/product/${category.slug}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <h3 className="text-lg font-bold text-primary mb-4 hover:text-primary/80 cursor-pointer flex items-center group">
                        {category.name}
                        <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </h3>
                    </Link>
                    <ul className="space-y-3">
                      {category.services.map((service) => (
                        <li key={service.slug}>
                          <Link
                            href={`/product/${category.slug}`}
                            onClick={(e) => {
                              e.preventDefault();
                              setIsOpen(false);
                              setLocation(`/product/${category.slug}`);
                              setTimeout(() => {
                                window.dispatchEvent(
                                  new CustomEvent("select-pricing-service", {
                                    detail: {
                                      category: category.slug,
                                      slug: service.slug,
                                    },
                                  })
                                );
                              }, 100);
                            }}
                          >
                            <span className="text-gray-600 hover:text-primary transition-all duration-300 cursor-pointer block hover:pl-2">
                              {service.name}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-4 border-t border-gray-100">
                <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
                  <span className="text-sm text-gray-500">
                    Explore our complete range of products and services
                  </span>
                  <Link href="/products" onClick={() => setIsOpen(false)}>
                    <div className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center cursor-pointer group">
                      View All Products
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}