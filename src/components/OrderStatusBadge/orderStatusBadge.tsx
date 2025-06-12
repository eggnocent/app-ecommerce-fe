import { ORDER_STATUS_CANCELED, ORDER_STATUS_DONE, ORDER_STATUS_EXPIRED, ORDER_STATUS_PAID, ORDER_STATUS_SHIPPED, ORDER_STATUS_UNPAID } from "../../const/order";

interface OrderBadge {
    name: string;
    backgroundColor: string;
    textColor: string;
}

const getOrderBadge = (code: string): OrderBadge => {
    switch (code) {
        case ORDER_STATUS_UNPAID:
      return {
        name: "Belum Dibayar",
        backgroundColor: "#FDE68A",
        textColor: "#92400E",
      };
    case ORDER_STATUS_PAID:
      return {
        name: "Dibayar",
        backgroundColor: "#6EE7B7",
        textColor: "#065F46",
      };
    case ORDER_STATUS_SHIPPED:
      return {
        name: "Dikirim",
        backgroundColor: "#BFDBFE",
        textColor: "#1E40AF",
      };
    case ORDER_STATUS_DONE:
      return {
        name: "Selesai",
        backgroundColor: "#C7D2FE",
        textColor: "#3730A3",
      };
    case ORDER_STATUS_EXPIRED:
      return {
        name: "Kedaluwarsa",
        backgroundColor: "#FBCFE8",
        textColor: "#9D174D",
      };
    case ORDER_STATUS_CANCELED:
      return {
        name: "Dibatalkan",
        backgroundColor: "#FECACA",
        textColor: "#991B1B",
      };
    default:
      return {
        name: "Unknown",
        backgroundColor: "#E5E7EB",
        textColor: "#374151",
      };
    }
}

interface OrderStatusBadgeProps {
    code: string;
}

function OrderStatusBadge(props:OrderStatusBadgeProps) {
    const orderBadge: OrderBadge = getOrderBadge(props.code);

    return (
        <span
            style={{
                backgroundColor: orderBadge.backgroundColor,
                color: orderBadge.textColor,
                padding: "4px 8px",
                borderRadius: "9999px",
                fontSize: "0.875rem",
                fontWeight: 500,
                whiteSpace: "nowrap"
            }}
        > {orderBadge.name} </span>
    )
}

export default OrderStatusBadge