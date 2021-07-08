import { useState } from "react";
import cookies from "next-cookies";
import CalendarContainer from "../../components/calendarContainer"
import Card from "../../components/card";
import Button from "../../components/button";
import Notice from "../../components/notice";
import { connect } from 'react-redux';

const CalendarPage = ({ blocks }) => {
  const initialPages = blocks || [];
  const [cards, setCards] = useState(initialPages.map((data) => data.block));

  const deleteCard = async (blockId) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API}/blocks/${blockId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const cardIndex = cards.map((block) => block._id).indexOf(blockId);
      const updatedCards = [...cards];
      updatedCards.splice(cardIndex, 1);
      setCards(updatedCards);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
        <CalendarContainer />
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { token } = cookies(context);
  const res = context.res;
  const req = context.req;

  if (!token) {
    res.writeHead(302, { Location: `/login` });
    res.end();
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/blocks`, {
      method: "GET",
      credentials: "include",
      // Forward the authentication cookie to the backend
      headers: {
        "Content-Type": "application/json",
        Cookie: req ? req.headers.cookie : undefined,
      },
    });
    const data = await response.json();
    const blockIdList = data.blocks;
    const blocks = await Promise.all(
      blockIdList.map(async (id) => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/blocks/${id}`,
          {
            method: "GET",
            credentials: "include",
            // Forward the authentication cookie to the backend
            headers: {
              "Content-Type": "application/json",
              Cookie: req ? req.headers.cookie : undefined,
            },
          }
        );
        return await response.json();
      })
    );
    const filteredPages = blocks.filter((block) => !block.errCode);
    return { props: { blocks: filteredPages } };
  } catch (err) {
    console.log(err);
    return { props: {} };
  }
};

export default connect(
  state => state
)(CalendarPage);
