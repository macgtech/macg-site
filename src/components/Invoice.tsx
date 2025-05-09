"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { fetchOrderDetails } from "@/utils/api";
import { toast } from "react-toastify";

const Invoice = () => {
  const { orderId } = useParams();
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef(null);

  useEffect(() => {
    const loadOrderDetails = async () => {
      if (!orderId) return;

      try {
        const data = await fetchOrderDetails(orderId);
        if (data.success && Array.isArray(data.orderItems)) {
          setOrderItems(
            data.orderItems.map((item) => ({
              productName: item["ProductName"] || "Unknown Product",
              variant: item["Variant Name"] || "Default",
              quantity: Number(item["Quantity Ordered"]) || 1,
              price: Number(item["Price Per Unit"]) || 0,
              totalPrice: Number(item["Total Price for Item"]) || 0,
            }))
          );
        } else {
          toast.error("Failed to load order details.");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId]);

  const handlePrint = () => {
    if (invoiceRef.current) {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
        <head>
          <title>Invoice</title>
          <style>
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                margin: 0;
                padding: 0;
              }
              @page {
                size: A4;
                margin: 0;
              }
              .no-print {
                display: none;
              }
            }
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            .container {
              max-width: 800px;
              margin: auto;
              background: white;
              padding: 20px;
              border: 1px solid #ddd;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header img {
              max-width: 180px;
              margin-bottom: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: left;
            }
            th {
              background: #f4f4f4;
            }
            .total-section {
              text-align: right;
              margin-top: 20px;
              font-size: 16px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="/MacGLogo.png" alt="MacG TechnoloG Logo" />
              <h2>Invoice</h2>
              <p>MacG TechnoloG Limited</p>
              <p>10 Carniew Place, Dannemora, Auckland, 2014</p>
              <p>GST Number: ${process.env.NEXT_PUBLIC_GST_NUMBER}</p>
            </div>

            <div class="invoice-details">
              <p><strong>Invoice Number:</strong> ${orderId.replace("ORD-", "INV-")}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString("en-GB")}</p>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="width: 50%;">Item</th>
                  <th style="width: 20%;">Variant</th>
                  <th style="width: 10%; text-align: center;">Qty</th>
                  <th style="width: 10%; text-align: right;">Price</th>
                  <th style="width: 10%; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderItems
                  .map(
                    (item) => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.variant}</td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;">$${item.price.toFixed(2)}</td>
                  <td style="text-align: right;">$${item.totalPrice.toFixed(2)}</td>
                </tr>`
                  )
                  .join("")}
              </tbody>
            </table>

            <div class="total-section">
              <p>Subtotal: $${orderItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}</p>
              <p>GST (15%): $${(orderItems.reduce((sum, item) => sum + item.totalPrice, 0) * 0.15).toFixed(2)}</p>
              <p>Total: $${orderItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}</p>
            </div>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (loading) return <p>Loading invoice...</p>;
  if (!orderItems.length) return <p>No items found for this order.</p>;

  return (
    <div className="container mx-auto p-6">
      <div ref={invoiceRef} className="border p-6 bg-white shadow-lg max-w-2xl mx-auto">
        {/* Invoice Header */}
        <div className="text-center mb-4">
          <img src="/MacGLogo.png" alt="MacG TechnoloG" className="h-16 mx-auto mb-2" />
          <h2 className="text-2xl font-bold">Invoice</h2>
          <p>MacG TechnoloG Limited</p>
          <p>10 Carniew Place, Dannemora, Auckland, 2014</p>
          <p>GST Number: {process.env.NEXT_PUBLIC_GST_NUMBER}</p>
        </div>

        {/* Invoice Details */}
        <div className="mb-4">
          <p><strong>Invoice Number:</strong> {orderId.replace("ORD-", "INV-")}</p>
          <p><strong>Date:</strong> {new Date().toLocaleDateString("en-GB")}</p>
        </div>

        {/* Print Button */}
        <div className="text-center mt-6">
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
