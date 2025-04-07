import type { ParentComponent } from 'solid-js';
import { A } from "@solidjs/router"; // Import A for navigation links
import Logo from '/favicon.svg';

export const Layout: ParentComponent = (props) => {
  // Define classes for active/inactive links for cleaner code
  // --- Updated Styles ---
  const baseLinkClasses = "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
  const inactiveLinkClasses = "text-gray-700 hover:bg-gray-100 hover:text-gray-900";
  const activeLinkClasses = "bg-blue-600 text-white hover:bg-blue-700"; // Active link is primary blue
  // --- End Updated Styles ---

  return (
    <div class="min-h-screen bg-gray-100"> {/* Lighter page background */}
      {/* --- Updated Styles: Subtle border instead of shadow --- */}
      <header class="bg-white border-b border-gray-200">
        {/* --- End Updated Styles --- */}
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Responsive container */}
          <div class="flex justify-between items-center h-16"> {/* Flex container for logo and links */}

            {/* Logo / Site Title Section */}
            <div class="flex-shrink-0 flex items-center">
              <div class='flex items-center space-x-3'> {/* Adjusted spacing */}
                <img class="h-8 w-auto" src={Logo} alt="Cardiogram Logo" />
                {/* --- Updated Styles: Darker, bolder text --- */}
                <span class="font-semibold text-lg text-gray-800 hidden sm:inline">DoHAC API Accelerator</span>
                {/* --- End Updated Styles --- */}
              </div>
            </div>

            {/* Navigation Links Section */}
            {/* --- Updated Styles: Increased spacing --- */}
            <div class="flex items-center space-x-1 sm:space-x-2"> {/* Spacing between links */}
              {/* --- End Updated Styles --- */}
              <A
                href="/"
                class={baseLinkClasses}
                inactiveClass={inactiveLinkClasses}
                activeClass={activeLinkClasses}
                end={true} // Match only the exact "/" path
              >
                <span class="i-carbon-home text-lg mr-1"></span> {/* Removed responsive margin change */}
                Home
              </A>
              <A
                href="/api-test"
                class={baseLinkClasses}
                inactiveClass={inactiveLinkClasses}
                activeClass={activeLinkClasses}
              >
                <span class="i-carbon-api text-lg mr-1"></span>
                API Test
              </A>
              <A
                href="/dashboard"
                class={baseLinkClasses}
                inactiveClass={inactiveLinkClasses}
                activeClass={activeLinkClasses}
              >
                <span class="i-carbon-dashboard text-lg mr-1"></span>
                Dashboard
              </A>
              {/* Add more links here if needed */}
            </div>
          </div>
        </nav>
      </header>

      {/* Page Content Area */}
      {/* --- Updated Styles: Consistent padding and max-width --- */}
      <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* --- End Updated Styles --- */}
        {props.children}
      </main>
    </div>
  );
};
