import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { useEffect, useState } from "react"
import { useAnalystStore } from "../../../../stores/useAnalystStore"
import { dataAnalystType } from "../../../../types"
import { Button } from "../../../../components/ui/button"

const Analysts = () => {
  const { dataAnalyst, getDataAnalyst, total, typeAnalyst } = useAnalystStore()
  const [dataDiagram, setDataDiagram] = useState<dataAnalystType[]>([]);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    getDataAnalyst();
  }, [getDataAnalyst]);

  useEffect(() => {
    if (!dataAnalyst) return;
    const raw_data = dataAnalyst.map(item => ({
      "_id": item._id,
      "totalListen": item.totalListen,
      "totalLogin": item.totalLogin,
    }));

    setDataDiagram(raw_data);

    const timer = setTimeout(() => {
      setShouldAnimate(true);
      setAnimationKey(prev => prev + 1);
    }, 100);

    return () => clearTimeout(timer);
  }, [dataAnalyst])

  const changeType = async (type: string) => {
    useAnalystStore.setState({ typeAnalyst: type });
    await getDataAnalyst(type);
  }

  console.log(typeAnalyst);
  return (
    <div className="w-full">
      <div className="">
        <span className="font-semibold">Selection Option Follow:</span>
        <div className="inline-flex gap-3 ml-3">
          <Button size={'sm'} onClick={() => changeType('week')}
            className={`px-4 bg-zinc-600 text-white ${typeAnalyst === 'week' ? 'bg-green-600' : ''}`}
          >
            Week</Button>
          <Button size={'sm'} onClick={() => changeType('month')}
            className={`px-4 bg-zinc-600 text-white  ${typeAnalyst === 'month' ? 'bg-green-600' : ''}`}
          >
            Month</Button>
        </div>
      </div>
      <div className="flex">
        <div className="flex flex-wrap w-[40%] h-full p-4 gap-4">
          {total && total.length > 0 &&
            total.map((item, index) => (
              <Card key={`analyst-${index}`} className="w-[46%] h-[50%] text-center bg-zinc-800/50 border-zinc-700/50 hover:scale-105 transition-all animate-in">
                <CardHeader>
                  <CardTitle className="font-medium text-2xl">Total {item.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-3xl font-bold">{item.value}</span>
                </CardContent>
              </Card>
            ))
          }

        </div>
        <div className="w-full h-[45vh] h-3xl flex-1">
          <ResponsiveContainer width={'100%'} height={'100%'}>
            <BarChart data={dataDiagram} key={animationKey}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="totalLogin"
                fill="#0ea5e9"
                name={'Login'}
                isAnimationActive={shouldAnimate}
                animationDuration={800}
                animationBegin={200}
              />
              <Bar
                dataKey="totalListen"
                fill="#10b981"
                name={'Listen'}
                isAnimationActive={shouldAnimate}
                animationDuration={800}
                animationBegin={200}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div >
  )
}
export default Analysts