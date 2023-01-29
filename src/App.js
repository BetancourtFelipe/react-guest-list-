import './App.css';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

/** @jsxImportSource @emotion/react */

const headSectionStyle = css`
  background-color: #f13c20;
  box-shadow: 2px 2px 2px 2px #000000;
  margin: 20px;
`;

const eventAppStyle = css`
  display: inline-flex;
  flex-direction: row;
  justify-content: space-evenly;
  background-color: #4056a1;
  flex-wrap: wrap;
  border: 5px solid black;
`;

const newGuestStyle = css`
  background-color: #c5cbe3;
  width: 600px;
  height: 150px;
  box-shadow: 2px 2px 2px 4px #000000;
  margin: 10px;
`;
const guestFormStyle = css`
  display: grid;
`;

const buttonStyle = css`
  margin: 15px;
  padding: 15px;
  font-size: 12px;
  background-color: white;
  border: 2px solid black;
`;

const headSectionGuestlist = css`
  background-color: white;
`;

const guestListStyle = css`
  background-color: lightgrey;
  width: 550px;
  height: 600px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;
  box-shadow: 2px 2px 2px 4px #000000;
  align-items: center;
  margin: 10px;
  width: 90%;
  height: 50%;
`;

const guestListItemStyle = css`
  justify-content: center;
  align-items: flex-start;
`;

// function hallo() {}
// const hallo = () => {}

export default function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [attending, setAttending] = useState(false);
  const [guests, setGuests] = useState([]);
  const [refetch, setRefetch] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  const baseUrl = 'http://localhost:4000';

  async function addGuest() {
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName: firstName, lastName: lastName }),
    });

    const createdGuest = await response.json();
  }

  async function updateGuest(attend, id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: attend }),
    });

    const updatedGuest = await response.json();
    console.log(updateGuest);
    setRefetch(!refetch);
  }

  async function onSubmit(event) {
    event.preventDefault();

    await addGuest();
    const newState = [...guests, { firstName, lastName, attending: attending }];
    setGuests(newState);
    setFirstName('');
    setLastName('');
  }

  useEffect(() => {
    async function fetchGuests() {
      const response = await fetch('http://localhost:4000/guests');

      const data = await response.json();
      console.log(data);

      setGuests(data);

      setIsLoading(false);
    }
    fetchGuests().catch((error) => console.log(error));
  }, [refetch]);

  if (isLoading) {
    return <h1>LOADING.....</h1>;
  }

  return (
    <div data-test-id="guest">
      <section css={headSectionStyle}>EVENT GUEST LIST </section>
      <div css={eventAppStyle}>
        <div css={newGuestStyle}>
          <h2>New Guest</h2>

          <div css={guestFormStyle}>
            <form onSubmit={(event) => onSubmit(event)}>
              <label>
                First Name:
                <input
                  value={firstName}
                  placeholder="First Name"
                  onChange={(event) => setFirstName(event.currentTarget.value)}
                />
              </label>
              <label>
                Last Name:
                <input
                  value={lastName}
                  placeholder="Last Name"
                  onChange={(event) => setLastName(event.currentTarget.value)}
                />
              </label>
              <button css={buttonStyle}>Add Guest</button>
            </form>
          </div>
        </div>
        <div css={guestListStyle}>
          <section css={headSectionGuestlist}>Guest List</section>
          <div css={guestListItemStyle}>
            {guests.map((guest) => {
              return (
                <div key={guest.id}>
                  <h3>
                    {guest.firstName} {guest.lastName}
                  </h3>
                  <input
                    className="myInput"
                    aria-label="attending"
                    checked={guest.attending}
                    type="checkbox"
                    onChange={(
                      event, // setAttending(event.currentTarget.checked)
                    ) => updateGuest(event.currentTarget.checked, guest.id)}
                  />
                  is {isChecked ? '' : 'not'} attending!
                  <button
                    aria-label="Remove"
                    onClick={() => {
                      setGuests(
                        guests.filter((g) => g.firstName !== guest.firstName),
                      );
                      setIsLoading(true);
                      setRefetch(!refetch);
                    }}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
