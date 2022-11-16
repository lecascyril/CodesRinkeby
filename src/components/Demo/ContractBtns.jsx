import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";


function ContractBtns({ setValue, setText }) {
  const { state: { contract, accounts } } = useEth();
  const [inputValue, setInputValue] = useState("");
  const [inputText, setInputText] = useState("");


  const handleInputChange = e => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setInputValue(e.target.value);
    }
  };

  const read = async () => {
    const value = await contract.methods.read().call({ from: accounts[0] });
    setValue(value);
  };

  function getRPCErrorMessage(err){
    var open = err.stack.indexOf('{')
    var close = err.stack.lastIndexOf('}')
    var j_s = err.stack.substring(open, close + 1);
    var j = JSON.parse(j_s);
    var reason = j.data[Object.keys(j.data)[0]].reason;
    return reason;
}


  const write = async e => {
    if (e.target.tagName === "INPUT") {
      return;
    }
    if (inputValue === "") {
      alert("Please enter a value to write.");
      return;
    }
    const newValue = parseInt(inputValue);

    try {
      await contract.methods.write(newValue).call();
      await contract.methods.write(newValue).send({ from: accounts[0] });
    }
    catch (err) {
      alert(err);
    }
  };

  const handleTextChange = e => {
      setInputText(e.target.value);
  };

  const greet = async () => {
    const text = await contract.methods.greet().call();
    setText(text);
  };

  const setGreet = async e => {
    if (e.target.tagName === "INPUT") {
      return;
    }
    if (inputText === "") {
      alert("Please enter a value to write.");
      return;
    }
    const newText = inputText;
    const result = await contract.methods.setGreet(newText).send({ from: accounts[0] });
    console.log(result);
  };


  return (
    <div className="btns">

      <button onClick={read}>
        read()
      </button>

      <div onClick={write} className="input-btn">
        write(<input
          type="text"
          placeholder="uint"
          value={inputValue}
          onChange={handleInputChange}
        />)
      </div>

      <button onClick={greet}>
        greet()
      </button>

      <div onClick={setGreet} className="input-btn">
        setGreet(<input
          type="text"
          placeholder="string"
          value={inputText}
          onChange={handleTextChange}
        />)
      </div>

    </div>
  );
}

export default ContractBtns;
