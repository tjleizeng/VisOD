# VisOD 

OD data records the traffic flows between origins(O) and destinations(D). It is widely used in transportation and other fields like internet networks. This data, though very useful in modeling, is challenging for understanding. Given OD matrix between n nodes, one would get nxn connections. Visualization all those connections would make the graph looks messy and hard to read. Moreover, purely OD does not tell anything about the time, but time is also an import dimension to many real world applications. 

This project is aiming to create a <b>easy to use</b> visualize program of OD matrix using React and Deck.gl.

The demo is shown in https://visodtest.netlify.com/. The data source is NYC Open Data.

To do list (2020/7/8)
1. Add visualization for OD during the pandemic.

To do list (2019/4/25)
1. Add legend to od lines.
2. Add file selection, for changing data files.

To do list (2019/3/13)
1. Add legend to od lines.
2. Redo interaction, display color after picking certain areas. (Done)
3. Add time chart. (Done)
