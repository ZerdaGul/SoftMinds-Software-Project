import React, { useEffect, useState } from 'react'
import classNames from 'classnames';
import back from '../../assets/icons/arrow-back-orange.svg';
import forward from '../../assets/icons/arrow-forward-orange.svg';
import './pagination.scss'

const Pagination = ({currentPage, totalPages, onPageChange}) => {
	const [initialPage, setInitialPage] = useState(currentPage);
	const [lastPage, setLastPage] = useState(totalPages<3 ? totalPages : initialPage+2);
	const [workingPages, setWorkingPages] = useState([])
	

	useEffect(() => {
		if (currentPage>lastPage && currentPage<=totalPages) {
			setInitialPage(initialPage => initialPage+1);
			setLastPage(lastPage => lastPage+1)
		} else if(currentPage<initialPage && currentPage>1) {
			setInitialPage(initialPage => initialPage-1);
			setLastPage(lastPage=>lastPage-1);
		}
		setWorkingPages([initialPage, initialPage+1, lastPage]);
	}, [currentPage, initialPage, lastPage])

	return (
		<div className="pagination__wrapper">
			<button 
				onClick={()=> onPageChange(currentPage, -1)}
				className="pagination__arrow"
				disabled={currentPage <= 1}>

				<img src={back} alt="page-back" />
			</button>
			<div className="pagination__body">
				{workingPages.map(page => {
					const itemClasses = classNames("pagination__page", {active: page===currentPage})
					return(
						<button key={page}
								onClick={() => onPageChange(page)}
								className={itemClasses}>{page}</button>
					)
				})}
				{totalPages>3 ? <>
						<div className="pagination__page">...</div>
						<button key={totalPages}
							onClick={() => onPageChange(totalPages)}
							className="pagination__page">{totalPages}</button>
				</>
						
					:null}
			</div>
			<button 
				onClick={()=> onPageChange(currentPage, 1)}
				className="pagination__arrow"
				disabled={currentPage >= totalPages}>

				<img src={forward} alt="page-forward" />
			</button>
		</div>
	)
}

export default Pagination