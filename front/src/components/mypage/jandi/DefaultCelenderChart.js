// yarn add @nivo/core @nivo/calendar
import { ResponsiveCalendar } from '@nivo/calendar';
// import data from './data.json';

const DefaultCelenderChart = ({ data }) => (
  <div className="" style={{ height: 300 }}>
    <ResponsiveCalendar
      data={data}
      from="2022-01-01"
      to="2022-12-31"
      emptyColor="#eeeeee"
      colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
      margin={{
        top: 100,
        right: 30,
        bottom: 60,
        left: 30,
      }}
      yearSpacing={60}
      monthBorderColor="#ffffff"
      monthLegendOffset={10}
      dayBorderWidth={2}
      dayBorderColor="#ffffff"
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'row',
          translateY: 36,
          itemCount: 4,
          itemWidth: 34,
          itemHeight: 36,
          itemDirection: 'top-to-bottom',
        },
      ]}
    />
  </div>
);
export default DefaultCelenderChart;