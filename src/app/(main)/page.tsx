export default function Dashboard() {
  return (
    <>
      <div className="head-title">
        <div className="left">
          <h1>Dashboard</h1>
          <ul className="breadcrumb">
            <li>
              <a href="#">Dashboard</a>
            </li>
            <li><i className='bx bx-chevron-right'></i></li>
            <li>
              <a className="active" href="#">Home</a>
            </li>
          </ul>
        </div>
        
      </div>

      <ul className="box-info">
        <li>
          <i className='bx bxs-calendar-check'></i>
          <span className="text">
            <h3>1111</h3>
            <p>New Order</p>
          </span>
        </li>
        <li>
          <i className='bx bxs-group'></i>
          <span className="text">
            <h3>2222</h3>
            <p>Visitors</p>
          </span>
        </li>
        <li>
          <i className='bx bxs-dollar-circle'></i>
          <span className="text">
            <h3>$3333.00</h3>
            <p>Total Sales</p>
          </span>
        </li>
      </ul>

      <div className="table-data">
        <div className="order">
          <div className="head">
            <h3>Recent Orders</h3>
            <i className='bx bx-search'></i>
            <i className='bx bx-filter'></i>
          </div>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Date Order</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <img src="https://placehold.co/100x100" alt="User" />
                  <p>David mishra</p>
                </td>
                <td>23-12-2025</td>
                <td><span className="status completed">Completed</span></td>
              </tr>
              <tr>
                <td>
                  <img src="https://placehold.co/100x100" alt="User" />
                  <p>Anita Mishra</p>
                </td>
                <td>22-12-2025</td>
                <td><span className="status pending">Pending</span></td>
              </tr>
              <tr>
                <td>
                  <img src="https://placehold.co/100x100" alt="User" />
                  <p>Vibhuti Mishra</p>
                </td>
                <td>21-12-2025</td>
                <td><span className="status process">Process</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        
      </div>
    </>
  );
}