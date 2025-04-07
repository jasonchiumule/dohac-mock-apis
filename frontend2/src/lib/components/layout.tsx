import type { ParentComponent } from 'solid-js';
import { A } from "@solidjs/router"; // Import A for navigation links

// Import the logo asset - Adjust path if needed based on your alias setup
// Vite typically sets up '~' to point to 'src', so '~/assets/...' should work.
import solidLogo from '~/assets/solid.svg';

export const Layout: ParentComponent = (props) => {
  // Define classes for active/inactive links for cleaner code
  const baseLinkClasses = "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out";
  const inactiveLinkClasses = "text-gray-600 hover:bg-gray-200 hover:text-gray-900";
  const activeLinkClasses = "bg-blue-100 text-blue-700"; // Style for the active route

  return (
    <div class="min-h-screen bg-gray-50"> {/* Optional: Background for the whole page */}
      <header class="bg-white shadow-sm border-b border-gray-200">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Responsive container */}
          <div class="flex justify-between items-center h-16"> {/* Flex container for logo and links */}

            {/* Logo / Site Title Section */}
            <div class="flex-shrink-0 flex items-center">
              <A href="/" class="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                <img class="h-8 w-auto" src={solidLogo} alt="Solid Logo" />
                <span class="font-semibold text-lg hidden sm:inline">DoHAC API Accelerator</span> {/* Hide text on very small screens */}
              </A>
            </div>

            {/* Navigation Links Section */}
            <div class="flex items-center space-x-2 sm:space-x-4"> {/* Spacing between links */}
              <A
                href="/"
                class={baseLinkClasses}
                inactiveClass={inactiveLinkClasses}
                activeClass={activeLinkClasses}
                end={true} // Match only the exact "/" path
              >
                <span class="i-carbon-home text-lg mr-1 sm:mr-2"></span>
                Home
              </A>
              <A
                href="/dashboard"
                class={baseLinkClasses}
                inactiveClass={inactiveLinkClasses}
                activeClass={activeLinkClasses}
              >
                <span class="i-carbon-dashboard text-lg mr-1 sm:mr-2"></span>
                Dashboard
              </A>
              {/* Add more links here if needed */}
            </div>
          </div>
        </nav>
      </header>

      {/* Page Content Area */}
      <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {props.children}
      </main>
    </div>
  );
};
