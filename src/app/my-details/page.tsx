"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetchUserDetails, updateUserDetails } from "@/utils/api";
import { toast } from "react-toastify";

const MyDetails = () => {
  const router = useRouter();
  const storedEmail = typeof window !== "undefined" ? localStorage.getItem("email") : null;
  
  const addressInputRef = useRef<HTMLInputElement | null>(null);
  const companyAddressInputRef = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [companyTickBox, setCompanyTickBox] = useState(false);
  const [subscribe, setSubscribe] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserDetails = async () => {
      if (!storedEmail) {
        toast.error("No user email found. Redirecting to register...");
        router.push("/register"); // Redirect to register if no email
        return;
      }

      try {
        const data = await fetchUserDetails(storedEmail);
        console.log("📡 API Response:", data);

        if (data.success && data.message) {
          setEmail(data.message.email || "");
          setName(data.message.name || "");
          setPhone(data.message.phone ? String(data.message.phone) : "");
          setCompany(data.message.company || "");
          setDeliveryAddress(data.message.address || "");
          setCompanyAddress(data.message.companyAddress || "");
          setSubscribe(data.message.subscribe === "Yes");
          setCompanyTickBox(!!data.message.company); // ✅ Auto-check if company exists
        } else {
          console.error("❌ Invalid user data:", data);
        }
      } catch (error) {
        console.error("❌ Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserDetails();
  }, [storedEmail, router]);

  // ✅ Google Maps Address Autocomplete (Delivery Address)
  useEffect(() => {
    const initAutocomplete = () => {
      if (typeof window !== "undefined" && window.google && addressInputRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(addressInputRef.current, {
          types: ["geocode"],
          componentRestrictions: { country: ["AU", "NZ"] },
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place && place.formatted_address) {
            setDeliveryAddress(place.formatted_address);
          }
        });
      } else {
        console.warn("❌ Google Maps API not loaded yet.");
        setTimeout(initAutocomplete, 500); // Retry after 500ms
      }
    };

    initAutocomplete();
  }, []);

  // ✅ Google Maps Address Autocomplete (Company Address)
  useEffect(() => {
    const initAutocomplete = () => {
      if (typeof window !== "undefined" && window.google && companyAddressInputRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(companyAddressInputRef.current, {
          types: ["geocode"],
          componentRestrictions: { country: ["AU", "NZ"] },
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place && place.formatted_address) {
            setCompanyAddress(place.formatted_address);
          }
        });
      } else {
        console.warn("❌ Google Maps API not loaded yet.");
        setTimeout(initAutocomplete, 500); // Retry after 500ms
      }
    };

    initAutocomplete();
  }, []);

  const handleSave = async () => {
    try {
      const response = await updateUserDetails({
        email,
        name,
        phone,
        company: companyTickBox ? company : "",
        address: deliveryAddress,
        companyAddress,
        subscribe: subscribe ? "Yes" : "No",
      });

      if (response.success) {
        toast.success("Details updated successfully!");
      } else {
        toast.error("Failed to update details.");
      }
    } catch (error) {
      console.error("❌ Error updating user details:", error);
      toast.error("Failed to update details.");
    }
  };

  if (loading) return <p>Loading user details...</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ✅ Name */}
        <div>
          <label className="block font-semibold">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>

        {/* ✅ Phone */}
        <div>
          <label className="block font-semibold">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>

        {/* ✅ Company Name Toggle */}
        <div className="col-span-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={companyTickBox}
              onChange={(e) => setCompanyTickBox(e.target.checked)}
              className="mr-2"
            />
            Use a Company Name
          </label>
        </div>

        {/* ✅ Company Name - Only show if ticked */}
        {companyTickBox && (
          <div className="col-span-2">
            <label className="block font-semibold">Company Name</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>
        )}

        {/* ✅ Delivery Address */}
        <div className="col-span-2">
          <label className="block font-semibold">Delivery Address</label>
          <input
            ref={addressInputRef}
            type="text"
            placeholder="Delivery Address"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            required
            className="p-2 border rounded w-full"
          />
        </div>

        {/* ✅ Invoice Address */}
        <div className="col-span-2">
          <label className="block font-semibold">Company Address (for invoices)</label>
          <input
            ref={companyAddressInputRef}
            type="text"
            placeholder="Company Invoice Address"
            value={companyAddress}
            onChange={(e) => setCompanyAddress(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>

        {/* ✅ Subscribe Checkbox */}
        <div className="col-span-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={subscribe}
              onChange={(e) => setSubscribe(e.target.checked)}
              className="mr-2"
            />
            Subscribe to newsletter
          </label>
        </div>
      </div>

      {/* ✅ Save Button */}
      <button
        onClick={handleSave}
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Save Details
      </button>
    </div>
  );
};

export default MyDetails;
