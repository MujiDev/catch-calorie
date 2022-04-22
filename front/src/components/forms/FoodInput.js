import React, { useState, useEffect } from "react";
import { InputGroup, FloatingLabel, Form, Dropdown } from "react-bootstrap";
import axios from "axios";

const FoodInput = () => {
    const [foods, setFoods] = useState([]);
    const [search, setSearch] = useState("");
    const [isFocus, setIsFocus] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            const res = await axios.get(`http://localhost:5002/foods?search=${search}`);
            const data = await res.data;
            setFoods(data);
        };
        fetch();
    }, [search]);

    return (
        <>
            <InputGroup>
                <FloatingLabel
                    label="Search Food ..." //
                    style={{ margin: "0 auto" }}
                    onChange={(event) => setSearch(event.target.value)}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                >
                    <Form.Control type="text" placeholder="Search Food ..." style={{ width: 480 }} />
                    {isFocus && (
                        <Dropdown.Menu show style={{ width: 480, marginTop: -2, padding: 0 }}>
                            {foods.length > 0 ? (
                                foods.map((foods) => (
                                    <Dropdown.Item key={foods._id}>
                                        {foods.name}
                                        <span style={{ float: "right", fontSize: 15, color: "gray" }}>{foods.kcal_per100g} kcals</span>
                                    </Dropdown.Item>
                                ))
                            ) : (
                                <Dropdown.Item key={"Food is not defined."}>검색 결과를 찾을 수 없습니다.</Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    )}
                </FloatingLabel>
            </InputGroup>
        </>
    );
};

export default FoodInput;
