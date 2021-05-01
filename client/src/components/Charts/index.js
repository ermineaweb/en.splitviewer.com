import React from "react";
import styles from "./charts.module.css";
import { Line, LineChart, Tooltip } from "recharts";
import useStatsStreamer from "../../hooks/useStatsStreamer";
import { kFormatter, randomItemInArray } from "../../utils";
import Progress from "../Progress";
import useLastSession from "../../hooks/useLastSession";
import { FaTwitter } from "react-icons/fa";

// function StatsNumber({ value, progress, kFormat = false, label }) {
//   return (
//     value >= 0 && (
//       <div className={styles.progress}>
//         <h4>
//           {kFormat ? kFormatter(value) : value} {label}
//         </h4>
//         <>bla</>
//         {progress && (
//           <div>
//             <Progress number={value} size={30} />
//           </div>
//         )}
//       </div>
//     )
//   );
// }

function Charts({ session, statsDay, statsWeek }) {
  const formatter = (value, name) => {
    switch (name) {
      case "nb_viewers":
        return [`${value}`, "viewers"];
      case "total_hours":
        return [`${value}h`, "heures vues"];
    }
  };

  const generateMessage = (nb, username) => {
    const absentMessages = [
      `Peu de streams pour juger réellement du niveau de ${username}, mais nous avons pu constater au cours de l'année une bonne participation et un sérieux dans le travail. A surveiller au trimestre prochain.`,
      `Des absences nombreuses et répétées, ce qui ne permet pas d'évaluer correctement ${username}. Il faut continuer les efforts et les résultats progresseront. `,
    ];
    const lowMessages = [
      `Le début de l'année fut un peu difficile avec ${kFormatter(
        nb
      )} viewers mais ${username} semble s’être mis au travail. Il faudra encore progresser au prochain trimestre. Attention à bien rester focus en stream.`,
      `${username} participe de plus en plus avec ${kFormatter(
        nb
      )} viewers, ce qui permet de constater une bonne maîtrise sur certains jeux. II faudrait maintenant approfondir le travail personnel.`,
      `L'ensemble est un peu juste avec ${kFormatter(
        nb
      )} viewers, il faut régulièrement rappeler à l'ordre ${username} qui a tendance à se laisser aller au bavardage. C'est dommage car il y a présence de capacités non exploitée.`,
      `Un trimestre en dents de scie avec ${kFormatter(
        nb
      )} viewers, mais le niveau reste correct. Plus de concentration en stream serait profitable à ${username} !`,
      `Une petite remontée ce trimestre avec ${kFormatter(
        nb
      )} viewers, mais le niveau est encore un peu juste. Il faut s'impliquer davantage ${username}.
`,
    ];
    const mediumMessages = [
      `${username} s'applique au travail, ce qui vient de payer au dernier stream avec ${kFormatter(
        nb
      )} viewers. II faut poursuivre les efforts.`,
      `Après un début difficile. ${username} tient le bon bout avec ${kFormatter(
        nb
      )} viewers. Il faut continuer à travailler pour que les résultats progressent encore.`,
      `Le bilan est positif avec ${kFormatter(
        nb
      )} viewers, ${username} fait des efforts. Je l'encourage à continuer ainsi, il devrait bien progresser tout au long de l'année avec une telle attitude.`,
      `Dommage ${username} qu il y ait un stream raté qui vienne perturber la moyenne, sinon c'est un bon travail avec ${kFormatter(
        nb
      )} viewers. Il faut continuer ainsi.`,
      `Un bon stream de ${username} avec ${kFormatter(
        nb
      )} viewers, bon rythme de travail ce qui permet cette belle progression, c'est encourageant. Maintenant il faut tenir jusqu'à la fin de l'année.
`,
      `Une belle réussite pour ${username} pour cette année avec ${kFormatter(
        nb
      )} viewers. Peut-être faut-il encore travailler la concentration (${username} semble un peu perdu parfois) pour continuer de progresser.`,
    ];
    const goodMessages = [
      `C'est vraiment très bien ${username} avec ${kFormatter(
        nb
      )} viewers, tant au niveau des résultats que de l'attitude en stream. Félicitations. Comportement sérieux et agréable.
`,
      `Le travail de ${username} est sérieux avec ${kFormatter(
        nb
      )} viewers, le niveau est correct, il faut continuer ainsi.
`,
      `C'est très bien ${kFormatter(
        nb
      )} viewers. Bonne participation. Attitude très positive. Il faut continuer ainsi ${username}.`,
      `Très bon trimestre. ${username} a su s’adapter aux méthodes de travail et se remettre à niveau quand c'était nécessaire. Très bonne participation avec ${kFormatter(
        nb
      )} viewers.
`,
      `Très bon stream, fruit d'un travail rigoureux et de qualité. ${username} fait tous les efforts nécessaires pour obtenir cet excellent niveau avec ${kFormatter(
        nb
      )} viewers. Bravo !`,
    ];

    switch (true) {
      case !nb:
        return randomItemInArray(absentMessages);
      case nb < 8000:
        return randomItemInArray(lowMessages);
      case nb < 25000:
        return randomItemInArray(mediumMessages);
      default:
        return randomItemInArray(goodMessages);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.indicators}>
        <h4>Stream du {session.daysession}</h4>
        {session?.nb_viewers && <h4>{kFormatter(session?.nb_viewers)} viewers</h4>}
        <div>
          <Progress number={session?.progress_nb_viewers} size={30} />
        </div>
        <a
          rel={"noreferrer"}
          className={styles.tweetbtn}
          href={`http://twitter.com/intent/tweet?text=${generateMessage(
            session?.nb_viewers,
            session.display_name
          )}&hashtags=twitch,${session.display_name}&via=splitviewer`}
          target="_blank"
        >
          <FaTwitter size={28} color={"white"} />
          Tweeter
        </a>
      </div>

      <div className={styles.charts}>
        <div className={styles.chart}>
          <LineChart width={300} height={140} data={statsDay}>
            <Line type="monotone" dataKey="nb_viewers" stroke="#cb4081" strokeWidth={5} />
            <Tooltip formatter={formatter} />
          </LineChart>
          Viewers par jour
        </div>

        <div className={styles.chart}>
          <LineChart width={300} height={140} data={statsWeek}>
            <Line type="monotone" dataKey="nb_viewers" stroke="#cb4081" strokeWidth={5} />
            <Tooltip formatter={formatter} />
          </LineChart>
          Viewers par semaine
        </div>
      </div>
    </div>
  );
}

function ChartsWithData({ id }) {
  const { session, loading } = useLastSession({ id });
  const { stats: statsDay, loading: loadingDay } = useStatsStreamer({ id, type: "day" });
  const { stats: statsWeek, loading: loadingWeek } = useStatsStreamer({ id, type: "week" });
  if (loading || loadingDay || loadingWeek) return null;
  return <Charts session={session} statsDay={statsDay} statsWeek={statsWeek} />;
}

export default React.memo(ChartsWithData);
