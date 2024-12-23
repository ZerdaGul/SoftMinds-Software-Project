import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { GetOrdersHistory } from '../../services/ProductService';
import InfoModal from '../modals/InfoModal';
import OrderDetailsModal from '../order-admin/order-details/OrderDetailsModal';
import "./customerOrders.scss";

const OrderList = ({ title, orders, onOpenDetails }) => (
	<div className="history__block">
		<div className="history__title">{title}</div>
		<ul className="history__products">
		{orders?.length > 0 ? (
			orders.map((order) => {
			const { id, order_Date, orderItems } = order;
			const amount = Array.isArray(orderItems) ? orderItems.length : 0;
			return (
				<li key={id} className="history__product">
				<div
					onClick={() => onOpenDetails(order)}
					className="history__product-name"
				>
					{new Date(order_Date).toLocaleDateString()}
				</div>
				<div className="history__product-amount">{amount}</div>
				</li>
			);
			})
		) : (
			<li className="history__product">
			<div className="history__product-name">No orders in this category.</div>
			</li>
		)}
		</ul>
	</div>
	);

	const CustomerOrders = ({ userId }) => {
	const [inProgressOrders, setInhistoryOrders] = useState([]);
	const [doneOrders, setDoneOrders] = useState([]);
	const [rejectedOrders, setRejectedOrders] = useState([]);
	const [showDetails, setShowDetails] = useState(false);
	const [orderToShow, setOrderToShow] = useState({});
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [showModal, setShowModal] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		updateOrders();
	}, []);

	const onError = (error) => {
		setError(true);
		setShowModal(true);
		setErrorMessage(error.message);
	};

	const updateOrders = async () => {
		try {
		const data = await GetOrdersHistory(userId);
		setRejectedOrders(data.rejected);
		setDoneOrders(data.done);
		setInhistoryOrders(data.inProgress);
		} catch (error) {
		onError(error);
		}
	};

	const onOpenDetails = (order) => {
		setOrderToShow(order);
		setShowDetails(true);
	};

	const renderModal = (
		<div>
		{showModal && error &&
			createPortal(
			<InfoModal
				title={"Error"}
				subtitle={errorMessage}
				onClose={() => {
				setShowModal(false);
				navigate('/');
				}}
			/>,
			document.body
			)}
		{showDetails &&
			createPortal(
			<OrderDetailsModal
				order={orderToShow}
				onClose={() => setShowDetails(false)}
				showActions={false}
			/>,
			document.body
			)}
		</div>
	);

	return (
		<section className="history">
		<OrderList
			title="In Progress"
			orders={inProgressOrders}
			onOpenDetails={onOpenDetails}
		/>
		<OrderList
			title="Done"
			orders={doneOrders}
			onOpenDetails={onOpenDetails}
		/>
		<OrderList
			title="Rejected"
			orders={rejectedOrders}
			onOpenDetails={onOpenDetails}
		/>
		{renderModal}
		</section>
	);
};

export default CustomerOrders;
