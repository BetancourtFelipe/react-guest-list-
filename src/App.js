import './App.css';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

/** @jsxImportSource @emotion/react */

const newGuestStyle = css`
  background-color: lightblue;
  width: 550px;
  height: 200px;
`;

const buttonStyle = css`
  margin: 20px;
  padding: 20px;
  font-size: 16px;
  background-color: white;
  border: 2px solid black;
`;
// const guestListStyle = css`
//   background-color: lightgrey;
//   width: 550px;
//   height: 600px;
//   display: flex;
//   flex-direction: row;
//   align-items: flex-start;
// `;

// function hallo() {}
// const hallo = () => {}

export default function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [attending, setAttending] = useState(false);
  const [guests, setGuests] = useState([]);
  const [refetch, setRefetch] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

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
    return <h1>LOADING</h1>;
  }

  return (
    <div data-test-id="guest">
      <div css={newGuestStyle}>
        <h2>New Guest</h2>

        <div>
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
          <button css={buttonStyle}>Delete All</button>
        </div>
        <div>
          {guests.map((guest) => {
            return (
              <div key={guest.id}>
                <h3>
                  {guest.firstName} {guest.lastName}
                </h3>
                <input
                  id="guestCheckBox"
                  aria-label="attending"
                  checked={guest.attending}
                  type="checkbox"
                  onChange={(event) =>
                    // setAttending(event.currentTarget.checked)
                    updateGuest(event.currentTarget.checked, guest.id)
                  }
                />

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
  );
}
