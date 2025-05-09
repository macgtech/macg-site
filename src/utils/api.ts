import axios from "axios";

const API_URL = "api/proxy";

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in environment variables");
}

// ✅ Fetch all products (GET)
export async function fetchProducts() {
  try {
    const response = await axios.get(`${API_URL}?action=getProducts`, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.data.success && Array.isArray(response.data.products)) {
      return response.data.products.map((product: any) => ({
        id: String(product["Product ID"]),
        name: product["Product Name"] || "Unknown Product",
        category: product["Category"] || "",
        subcategory: product["Subcategory"] || "",
        subSubcategory: product["Sub-Subcategory"] || "",
        specialCategory: product["Special Category"] || "",
        description: product["Description"] || "No description available.",
        price: Number(product["Price (GST Incl.)"]) || 0,
        specialprice: Number(product["Special Price"]) || null,
        stock: product["Stock"] || "",
        features: product["Features"] || "",
        tags: product["Tags"] || "",
        dimensions: product["Dimensions"] || "",
        imageUrls: [
          product["Image URL 1"],
          product["Image URL 2"],
          product["Image URL 3"],
          product["Image URL 4"],
          product["Image URL 5"],
          product["Image URL 6"],
          product["Image URL 7"],
          product["Image URL 8"],
          product["Image URL 9"],
          product["Image URL 10"],
          product["Video URL 1"],
          product["Video URL 2"],
          product["Video URL 3"],
        ].filter(Boolean),
        variants: product.variants && Array.isArray(product.variants)
          ? product.variants.map((variant: any) => ({
              name: variant.name || "Default Variant",
              barcode: variant.barcode || "",
              stock: variant.stock || "0",
              image: variant.image || "",
            }))
          : [],
      }));
    }
    return [];
  } catch {
    return [];
  }
}

// ✅ Set Password API Call (Ensure it gets a success message)
export async function setPassword(token: string, password: string) {
  try {
    const response = await fetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "setupPassword", token, password }),
    });

    return await response.json(); // ✅ Ensure success feedback
  } catch {
    return { success: false, message: "Failed to set password" };
  }
}

// ✅ Fetch user email by token (GET)
export async function getUserByToken(token: string) {
  try {
    const response = await fetch(`${API_URL}?action=getUserByToken&token=${token}`);
    return await response.json();
  } catch {
    return { success: false, message: "Failed to fetch user by token" };
  }
}

// ✅ Fetch cart for a specific user (GET)
export async function fetchCart(userId: string) {
  try {
    const response = await fetch(`/api/proxy?action=getCart&userId=${encodeURIComponent(userId)}`);
    const result = await response.json();

    if (!result.success || !Array.isArray(result.cart)) {
      console.error("Invalid cart data received:", result);
      return [];
    }

    return result.cart.map((item, index) => ({
      Productid: item.ProductID ? String(item.ProductID) : `Unknown-${index}`,
      ProductName: item.ProductName || "Missing Name",
      variant: item.Variant || "Default",
      quantity: Number(item.Quantity) || 1,
      price: Number(item.Price) || 0,
      totalPrice: Number(item.TotalPrice) || (Number(item.Quantity) * Number(item.Price)) || 0,
      image: item.Image || "/placeholder-image.png",
    }));
  } catch (error) {
    console.error("Error fetching cart:", error);
    return [];
  }
}

// ✅ Update Cart (Fire & Forget)
export function updateCart(userId: string, cart: any[]) {
  fetch("/api/proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "updateCart",
      userId,
      cart,
    }),
  });
}

// ✅ Update Cart Email (Fire & Forget)
export function updateCartEmail(oldEmail: string, newEmail: string) {
  if (!oldEmail || !newEmail || oldEmail === newEmail) return; // ✅ Skip if no change

  fetch("/api/proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "updateCartEmail", oldEmail, newEmail }),
  });
}


// ✅ Check if user exists (GET)
export async function checkUser(email: string) {
  try {
    console.log("📡 Checking user existence for:", email);

    const timestamp = new Date().getTime(); // Unique timestamp
    const response = await fetch(
      `/api/proxy?action=getUser&email=${encodeURIComponent(email)}&t=${timestamp}`,
      { cache: "no-store" } // Ensures fresh data is fetched
    );

    const data = await response.json();
    console.log("📡 API Response (checkUser):", data);

    return data;
  } catch (error) {
    console.error("❌ Error checking user:", error);
    return { exists: false, hasPassword: false };
  }
}

// ✅ Process Payment
export async function processPayment(userId: string, cart: any[], deliveryAddress: any, paymentMethod: string) {
  try {
    console.log("🔄 Initiating Payment Process...");

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "processPayment",
        userId,
        cart,
        deliveryAddress,
        paymentMethod,
      }),
    });

    console.log("📩 Received response:", response);

    const rawText = await response.text(); // Get raw text response
    console.log("📦 Raw API Response:", rawText); // Log raw response before parsing

    let result;
    try {
      result = JSON.parse(rawText);
    } catch (jsonError) {
      throw new Error(`❌ Failed to parse JSON: ${rawText}`);
    }

    console.log("📦 Parsed API Response:", result);

    if (!result.success) {
      throw new Error(`❌ API Error: ${result.message || "Unknown Error"}`);
    }

    console.log("✅ Order created successfully! Order ID:", result.orderId);
    return result.orderId; // ✅ Return orderId for Stripe payment
  } catch (error) {
    console.error("❌ Error processing payment:", error);
    alert(`Error processing payment: ${error.message}`);
    return null;
  }
}

// ✅ GET to confirm if last login is recent (<10s old)
export async function confirmRecentLogin(email: string) {
  try {
    const response = await fetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "confirmRecentLogin", email }),
    });

    return await response.json();
  } catch {
    return { success: false, message: "Failed to confirm recent login" };
  }
}

// Fetch user orders
export async function fetchOrders(email: string) {
  try {
    const response = await fetch(`/api/proxy?action=getOrders&email=${encodeURIComponent(email)}`);
    return await response.json();
  } catch {
    return [];
  }
}

// Fetch user orders
export const fetchUserOrders = async (email: string) => {
  const response = await fetch(`/api/proxy?action=getUserOrders&email=${encodeURIComponent(email)}`);
  return response.json();
};

// Fetch order details
export const fetchOrderDetails = async (orderId: string) => {
  const response = await fetch(`/api/proxy?action=getOrderDetails&orderId=${encodeURIComponent(orderId)}`);
  return response.json();
};

// Add items to cart
export const addToCart = async (items: OrderItem[]) => {
  const userEmail = localStorage.getItem("email");
  if (!userEmail) throw new Error("User not logged in");

  const response = await fetch("/api/proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "updateCart",
      userId: userEmail,
      cart: items.map((item) => ({
        productId: item.id,
        productName: item.name,
        variant: item.variant,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.totalPrice,
        image: item.image,
      })),
    }),
  });

  return response.json();
};


// Update user address
export async function updateUserAddress(email: string, newAddress: string, newBillingAddress: string) {
  try {
    await fetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updateUserAddress",
        email,
        deliveryAddress: newAddress,
        billingAddress: newBillingAddress,
      }),
    });
  } catch {
    return { success: false, message: "Failed to update address" };
  }
}


// Fetch user details by email
export async function fetchUserDetails(email) {
  try {
    const response = await fetch(`${API_URL}?action=getUserDetails&email=${encodeURIComponent(email)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: 'Failed to fetch user details' };
  }
}
// ✅ Update user details (POST)
export async function updateUserDetails(userData: {
  email: string;
  name: string;
  phone: string;
  company: string;
  address: string;
  companyAddress: string;
}) {
  try {
    const response = await fetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updateUserDetails",
        ...userData, // Spread all user details
      }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error updating user details:", error);
    return { success: false, message: "Failed to update details." };
  }
}

export async function createOrderInGoogleSheets(userEmail: string, cartItems: any[], totalWithDelivery: number, paymentMethod: string) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "processPayment",
        userId: userEmail,
        cart: cartItems,
        deliveryAddress: "User Address",
        paymentMethod,
      }),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.message);

    return data.orderId; // ✅ Return the Order ID from Google Sheets
  } catch (error) {
    console.error("❌ Google Sheets API Error:", error);
    return null;
  }
}

export async function sendBankTransferEmail(userEmail: string, name: string, orderId: string, totalAmount: number) {
  try {
    const response = await fetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "sendBankTransferEmail",
        userEmail,
        name,
        orderId,
        totalAmount,
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("❌ Error sending Bank Transfer email:", error);
    return { success: false, message: "Failed to send email" };
  }
}
// ✅ Register User (Fire & Forget)
export const registerUser = async (
  email: string,
  name: string,
  phone: string,
  companyName: string,
  deliveryAddress: string,
  companyAddress: string,
  subscribe: boolean,
  companyTickBox: boolean,
  oldEmail: string
) => {
  try {
    const response = await fetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "createUser",
        email,
        name,
        phone,
        companyName,
        deliveryAddress,
        companyAddress,
        subscribe: subscribe ? "Yes" : "No",
        companyTickBox: companyTickBox ? "Yes" : "No",
        oldEmail,
      }),
    });

    // ✅ Always return a JSON response
    const data = await response.json();
    return data; // Ensure it returns an object with { success, message }
  } catch (error) {
    console.error("Error in registerUser:", error);
    return { success: false, message: "Network error or invalid response" }; // ✅ Always return an object
  }
};
// ✅ Send password setup/reset link (Fire & Forget)
export function sendPasswordLink(email: string) {
  fetch("/api/proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "sendPasswordSetupEmail",
      email,
    }),
  });
}

// ✅ Validate user login (Ensure success feedback)
// utils/api.js

// Validate user login and update 'Last Logged In' timestamp
// ✅ POST to update Last Logged In timestamp

// ✅ POST to validate login and update Last Logged In timestamp
export async function validateLogin(email: string, password: string) {
  // Send POST request without waiting for the response
  fetch("/api/proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "validateLogin", email, password }),
  }).catch((err) => console.error("Login POST failed:", err));

  // ✅ Immediately check recent login without waiting for the POST to finish
  try {
    const confirmLogin = await confirmRecentLogin(email);

    if (confirmLogin.success) {
      return {
        success: true,
        message: "Login confirmed",
        email,
        address: confirmLogin.data.address,
        companyName: confirmLogin.data.companyName,
      };
    } else {
      return { success: false, message: "Recent login confirmation failed" };
    }
  } catch {
    return { success: false, message: "Login failed" };
  }
}
export async function updateOrderSheet(
  userEmail: string,
  cartItems: CartItem[],
  totalAmount: number,
  paymentMethod: string,
  paymentStatus: string
) {
  try {
    const response = await fetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updateOrderSheet",
        userEmail,
        cartItems,
        totalAmount,
        paymentMethod,
        paymentStatus,
      }),
    });

    const data = await response.json();
    if (!data.success) {
      console.error("Error updating order sheet:", data.message);
    }
  } catch (error) {
    console.error("Failed to update order sheet:", error);
  }
}



export async function sendPaymentEmail(email: string, orderId: string, amount: number, method: string) {
  try {
    const emailBody = `
      <p>Thank you for your order!</p>
      <p>Your Order ID: <strong>${orderId}</strong></p>
      <p>Total Amount: <strong>NZD ${amount.toFixed(2)}</strong></p>
      <p>Payment Method: <strong>${method}</strong></p>
      <p>Please use the following bank details for payment:</p>
      <ul>
        <li><strong>Bank:</strong> XYZ Bank</li>
        <li><strong>Account Number:</strong> 12345678</li>
        <li><strong>Reference:</strong> ${orderId}</li>
      </ul>
      <p>Once payment is made, please reply to this email with confirmation.</p>
    `;

    MailApp.sendEmail({
      to: email,
      subject: "Bank Transfer Payment Details",
      htmlBody: emailBody,
    });

    console.log(`✅ Payment email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Email Sending Error:", error);
    return { success: false, message: "Failed to send email" };
  }
}
// ✅ Fetch a specific product by ID
export async function fetchProductById(productId: string) {
    try {
        const response = await fetch(`/api/proxy?action=getProductById&productId=${productId}`);
        const result = await response.json();

        if (result.success && result.data) {
            const product = result.data;
            return {
                id: String(product["Product ID"]),
                name: product["Product Name"] || "Unknown Product",
                description: product["Description"] || "No description available.",
                price: Number(product["Price (GST Incl.)"]) || 0,
                specialprice: Number(product["Special Price"]) || null,
                features: product["Features"] || "",
                tags: product["Tags"] || "",
                dimensions: product["Dimensions"] || "",
                imageUrls: [
                    product["Image URL 1"],
                    product["Image URL 2"],
                    product["Image URL 3"],
                    product["Image URL 4"],
                    product["Image URL 5"],
                    product["Image URL 6"],
                    product["Image URL 7"],
                    product["Image URL 8"],
                    product["Image URL 9"],
                    product["Image URL 10"],
                    product["Video URL 1"],
                    product["Video URL 2"],
                    product["Video URL 3"],
                ].filter(Boolean),
                variants: product["Variant"] ? [
                    {
                        name: product["Variant"] || "Default Variant",
                        barcode: product["Variant Barcode"] || "",
                        stock: product["Stock"] ? String(product["Stock"]) : "0",
                        image: product["Image URL 1"] || "",
                    },
                ] : [],
            };
        }

        return null;
    } catch (error) {
        console.error("Failed to fetch product by ID:", error);
        return null;
    }
}
