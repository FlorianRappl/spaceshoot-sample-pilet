import * as React from 'react';
import { Game } from './scripts/Game';

let game: Game = undefined;

const Spaceshoot: React.FC = () => {
  const host = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    if (!game) {
      game = new Game();
    }

    game.init(host.current);
    game.resume();
    return () => game.pause();
  }, []);

  return (
    <div className="spaceshoot-page" ref={host}>
      <audio id="music" preload="auto" loop>
        <source src="sounds/music.mp3" />
        <source src="sounds/music.ogg" />
      </audio>
      <canvas id="canvas" width="1300" height="800">
        Your browser does not support the HTML5 canvas element.
      </canvas>
      <input type="text" id="chat-input" className="chat" autoComplete="off" />
      <output id="chat-output" className="chat"></output>
      <div id="inactive"></div>
      <div id="scorescreen">
        <ul>
          <li id="scorehead">CURRENT SCORE</li>
          <li>
            <ul id="scores"></ul>
          </li>
        </ul>
      </div>
      <div id="menuscreen">
        <p id="title">SpaceShoot</p>
        <ul id="menu-main">
          <li id="menu-sp" className="menuitem">
            new singleplayer game
          </li>
          <li id="menu-mphost" className="menuitem disabled">
            host multiplayer game <img src="connect.gif" hidden id="wsconnect" />
          </li>
          <li id="menu-mpjoin" className="menuitem disabled">
            join multiplayer game
          </li>
          <li id="menu-leave" className="menuitem" hidden>
            leave current game
          </li>
          <li id="menu-empty" className="menuitem" hidden>
            &nbsp;
          </li>
          <li id="menu-setname" className="menuitem">
            set player options
          </li>
          <li id="menu-setscr" className="menuitem">
            set general options
          </li>
          <li id="menu-lookkeys" className="menuitem">
            look up keys
          </li>
          <li id="menu-highscores" className="menuitem">
            show highscores
          </li>
          <li id="menu-scores" className="menuitem" hidden>
            show current scores
          </li>
          <li id="menu-esc" className="menuitem">
            exit menu
          </li>
        </ul>
        <ul id="menu-scr">
          <li>server ip</li>
          <li>
            <input type="text" id="menu-server-ip" />
          </li>
          <li>
            sound effects{' '}
            <span id="menu-wosounds" className="menuitem">
              off
            </span>{' '}
            |{' '}
            <span id="menu-withsounds" className="menuitem">
              on
            </span>
          </li>
          <li id="menu-scrsave" className="menuitem">
            save changes
          </li>
          <li id="menu-scrprevious" className="menuitem">
            go back
          </li>
        </ul>
        <ul id="menu-keys">
          <li>
            <span className="key">&uarr; / &darr;</span> accelerate / brake
          </li>
          <li>
            <span className="key">&larr; / &rarr;</span> turn left / right
          </li>
          <li>
            <span className="key">ctrl</span> place bomb
          </li>
          <li>
            <span className="key">space</span> shoot plasma
          </li>
          <li>
            <span className="key">tab</span> score screen
          </li>
          <li>
            <span className="key">esc</span> open menu
          </li>
          <li id="menu-keysprevious" className="menuitem">
            go back
          </li>
        </ul>
        <ul id="menu-scores">
          <li>
            <div id="menu-scores-list" className="menu-list"></div>
          </li>
          <li id="menu-scoresprevious" className="menuitem">
            go back
          </li>
        </ul>
        <ul id="menu-currentscores">
          <li>
            <div id="menu-current-scores-list" className="menu-list"></div>
          </li>
          <li id="menu-currentscoresprevious" className="menuitem">
            go back
          </li>
        </ul>
        <ul id="menu-host">
          <li>game name</li>
          <li>
            <input type="text" id="menu-game-name" />
          </li>
          <li>password (blank for public)</li>
          <li>
            <input type="password" id="menu-game-password" />
          </li>
          <li id="menu-hostadvanced" className="menuitem">
            advanced options
          </li>
          <li id="menu-hostmatch" className="menuitem">
            create game
          </li>
          <li id="menu-hostprevious" className="menuitem">
            go back
          </li>
        </ul>
        <ul id="menu-host-adv">
          <li>maximum players</li>
          <li>
            <input type="number" id="menu-game-maxplayers" defaultValue="64" max="64" min="1" />
          </li>
          <li>maximum bots</li>
          <li>
            <input type="number" id="menu-game-maxbots" defaultValue="0" max="63" min="0" />
          </li>
          <li>
            friendly fire{' '}
            <span className="menuitem picked" id="menu-friendly-off">
              off
            </span>{' '}
            |{' '}
            <span className="menuitem" id="menu-friendly-on">
              on
            </span>
          </li>
          <li>
            negative points{' '}
            <span className="menuitem picked" id="menu-negative-off">
              off
            </span>{' '}
            |{' '}
            <span className="menuitem" id="menu-negative-on">
              on
            </span>
          </li>
          <li>
            upgrade packs{' '}
            <span className="menuitem" id="menu-upgrades-off">
              off
            </span>{' '}
            |{' '}
            <span className="menuitem picked" id="menu-upgrades-on">
              on
            </span>
          </li>
          <li id="menu-hostadvprevious" className="menuitem">
            done
          </li>
        </ul>
        <ul id="menu-join">
          <li>
            <div id="menu-join-list" className="menu-list"></div>
          </li>
          <li id="menu-joinprevious" className="menuitem">
            go back
          </li>
        </ul>
        <ul id="menu-user">
          <li>user name</li>
          <li>
            <input type="text" id="menu-player-name" />
          </li>
          <li>primary / secondary color</li>
          <li>
            <input className="color" id="menu-primary-color" defaultValue="#66ff00" type="color" />{' '}
            <input className="color" id="menu-secondary-color" defaultValue="#66ff00" type="color" />
          </li>
          <li id="menu-usersave" className="menuitem">
            save changes
          </li>
          <li id="menu-userprevious" className="menuitem">
            go back
          </li>
        </ul>
      </div>
      <div id="dialog">
        <div id="dialog-message"></div>
        <div id="dialog-ok">Okay</div>
      </div>
    </div>
  );
};

export default Spaceshoot;
