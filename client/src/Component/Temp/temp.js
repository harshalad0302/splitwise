import React from 'react';
const countries =
[
    "Afghanistan",
    "Åland Islands",
    "Albania",
    "Algeria"
];
export default class MyFilteringComponent extends React.Component {
    state = {
        initialItems: [],
        items: []
    }
   

    filterList = (event) => {
      let items = this.state.initialItems;
      items = items.filter((item) => {
        return item.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
      });
      this.setState({items: items});
    }

    componentWillMount = () => {
      this.setState({
          initialItems: this.props.content,
          items: this.props.content
      })
    }

    render() {
      return (
        <div>
          <form>
                <input type="text" placeholder="Search" onChange={this.filterList}/>
          </form>
          <div>
            {
                this.state.items.map((item)=> {
                    return <div key={item}>{item}</div>
                })
            }
            </div>
        </div>
      );
    }
};