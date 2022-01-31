// import { useState } from "preact/compat";
import { h, FunctionalComponent } from 'preact';
import { useState } from "preact/hooks";

// import './ShareIconComponent.css';

export interface IProps {
  children?: string;
  alignIcons: string;
  link: string;
}

interface Item {
  id: number;
  name: string;
  link: string;
  icon: any;
}

import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
  FacebookShareCount,
  HatenaIcon,
  HatenaShareButton,
  HatenaShareCount,
  InstapaperIcon,
  InstapaperShareButton,
  LineIcon,
  LineShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  LivejournalIcon,
  LivejournalShareButton,
  MailruIcon,
  MailruShareButton,
  OKIcon,
  OKShareButton,
  OKShareCount,
  PinterestIcon,
  PinterestShareButton,
  PinterestShareCount,
  PocketIcon,
  PocketShareButton,
  RedditIcon,
  RedditShareButton,
  RedditShareCount,
  TelegramIcon,
  TelegramShareButton,
  TumblrIcon,
  TumblrShareButton,
  TumblrShareCount,
  TwitterIcon,
  TwitterShareButton,
  VKIcon,
  VKShareButton,
  VKShareCount,
  ViberIcon,
  ViberShareButton,
  WeiboIcon,
  WeiboShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  WorkplaceIcon,
  WorkplaceShareButton,
} from "./react-share";


//ref https://codepen.io/volitilov/pen/gxvyRX
const getAllIcons = (size:number = 40) => [
  { name: "facebook", icon: <FacebookIcon size={size} /> },
  { name: "twitter", icon: <TwitterIcon size={size} /> },
  { name: "linkedin", icon: <LinkedinIcon size={size} /> },
  { name: "pinterest", icon: <PinterestIcon size={size} /> },
  { name: "facebook-messenger", icon: <FacebookMessengerIcon size={size} /> },
  { name: "telegram", icon: <TelegramIcon size={size} /> },
  { name: "whatsapp", icon: <WhatsappIcon size={size} /> },
  { name: "vk", icon: <VKIcon size={size} /> },
  { name: "ok", icon: <OKIcon size={size} /> },
  { name: "reddit", icon: <RedditIcon size={size} /> },
  { name: "tumblr", icon: <TumblrIcon size={size} /> },
  { name: "live-journal", icon: <LivejournalIcon size={size} /> },
  { name: "mailru", icon: <MailruIcon size={size} /> },
  { name: "email", icon: <EmailIcon size={size} /> },
  { name: "viber", icon: <ViberIcon size={size} /> },
  { name: "workplace", icon: <WorkplaceIcon size={size} /> },
  { name: "line", icon: <LineIcon size={size} /> },
  { name: "weibo", icon: <WeiboIcon size={size} /> },
  { name: "pocket", icon: <PocketIcon size={size} /> },
  { name: "instapaper", icon: <InstapaperIcon size={size} /> },
  { name: "hatena", icon: <HatenaIcon size={size} /> },
];

const getShareIcon = (name: string, shareUrl:string, size = 64) => {
  if (name === "facebook") {
    return (
      <div className="Demo__some-network">
        <FacebookShareButton
          url={shareUrl}
          quote={name}
          className="Demo__some-network__share-button"
        >
          <FacebookIcon size={size} />
        </FacebookShareButton>

        {/* <div>
          <FacebookShareCount
            url={shareUrl}
            className="Demo__some-network__share-count"
          >
            {(count) => count}
          </FacebookShareCount>
        </div> */}
      </div>
    );
  } else if (name === "facebook-messenger") {
    return (
      <div className="Demo__some-network">
        <FacebookMessengerShareButton
          url={shareUrl}
          appId="521270401588372"
          className="Demo__some-network__share-button"
        >
          <FacebookMessengerIcon size={size} />
        </FacebookMessengerShareButton>
      </div>
    );
  } else if (name === "twitter") {
    return (
      <div className="Demo__some-network">
        <TwitterShareButton
          url={shareUrl}
          title={name}
          className="Demo__some-network__share-button"
        >
          <TwitterIcon size={size} /> 
        </TwitterShareButton>

        {/* <div className="Demo__some-network__share-count">&nbsp;</div> */}
      </div>
    );
  } else if (name === "telegram") {
    return (
      <div className="Demo__some-network">
        <TelegramShareButton
          url={shareUrl}
          title={name}
          className="Demo__some-network__share-button"
        >
          <TelegramIcon size={size} />
        </TelegramShareButton>

        {/* <div className="Demo__some-network__share-count">&nbsp;</div> */}
      </div>
    );
  } else if (name === "whatsapp") {
    return (
      <div className="Demo__some-network">
        <WhatsappShareButton
          url={shareUrl}
          title={name}
          separator=":: "
          className="Demo__some-network__share-button"
        >
          <WhatsappIcon size={size} />
        </WhatsappShareButton>

        {/* <div className="Demo__some-network__share-count">&nbsp;</div> */}
      </div>
    );
  } else if (name === "linkedin") {
    return (
      <div className="Demo__some-network">
        <LinkedinShareButton
          url={shareUrl}
          className="Demo__some-network__share-button"
        >
          <LinkedinIcon size={size} />
        </LinkedinShareButton>
      </div>
    );
  } else if (name === "pinterest") {
    return (
      <div className="Demo__some-network">
        <PinterestShareButton
          url={String(window.location)}
        //   media={`${String(window.location)}/${exampleImage}`}
          className="Demo__some-network__share-button"
        >
          <PinterestIcon size={size} />
        </PinterestShareButton>

        {/* <div>
          <PinterestShareCount
            url={shareUrl}
            className="Demo__some-network__share-count"
          />
        </div> */}
      </div>
    );
  } else if (name === "vk") {
    return (
      <div className="Demo__some-network">
        <VKShareButton
          url={shareUrl}
        //   image={`${String(window.location)}/${exampleImage}`}
          className="Demo__some-network__share-button"
        >
          <VKIcon size={size} />
        </VKShareButton>

        {/* <div>
          <VKShareCount
            url={shareUrl}
            className="Demo__some-network__share-count"
          />
        </div>*/}
      </div> 
    );
  } else if (name === "ok") {
    return (
      <div className="Demo__some-network">
        <OKShareButton
          url={shareUrl}
        //   image={`${String(window.location)}/${exampleImage}`}
          className="Demo__some-network__share-button"
        >
          <OKIcon size={size} />
        </OKShareButton>

        {/* <div>
          <OKShareCount
            url={shareUrl}
            className="Demo__some-network__share-count"
          />
        </div> */}
      </div>
    );
  } else if (name === "reddit") {
    return (
      <div className="Demo__some-network">
        <RedditShareButton
          url={shareUrl}
          title={name}
          windowWidth={660}
          windowHeight={460}
          className="Demo__some-network__share-button"
        >
          <RedditIcon size={size} />
        </RedditShareButton>

        {/* <div>
          <RedditShareCount
            url={shareUrl}
            className="Demo__some-network__share-count"
          />
        </div> */}
      </div>
    );
  } else if (name === "tumblr") {
    return (
      <div className="Demo__some-network">
        <TumblrShareButton
          url={shareUrl}
          title={name}
          className="Demo__some-network__share-button"
        >
          <TumblrIcon size={size} />
        </TumblrShareButton>

        {/* <div>
          <TumblrShareCount
            url={shareUrl}
            className="Demo__some-network__share-count"
          />
        </div> */}
      </div>
    );
  } else if (name === "live-journal") {
    return(
      <div className="Demo__some-network">
        <LivejournalShareButton
          url={shareUrl}
          title={name}
          description={shareUrl}
          className="Demo__some-network__share-button"
        >
          <LivejournalIcon size={size} />
        </LivejournalShareButton>
      </div>
    );
  } else if (name === "mailru") {
    return (
      <div className="Demo__some-network">
        <MailruShareButton
          url={shareUrl}
          title={name}
          className="Demo__some-network__share-button"
        >
          <MailruIcon size={size} />
        </MailruShareButton>
      </div>
    );
  } else if (name === "email") {
    return (
      <div className="Demo__some-network">
        <EmailShareButton
          url={shareUrl}
          subject={name}
          body="body"
          className="Demo__some-network__share-button"
        >
          <EmailIcon size={size} />
        </EmailShareButton>
      </div>
    );
  } else if (name === "viber") {
    return (
      <div className="Demo__some-network">
        <ViberShareButton
          url={shareUrl}
          title={name}
          className="Demo__some-network__share-button"
        >
          <ViberIcon size={size} />
        </ViberShareButton>
      </div>
    );
  } else if (name === "workplace") {
    return (
      <div className="Demo__some-network">
        <WorkplaceShareButton
          url={shareUrl}
          quote={name}
          className="Demo__some-network__share-button"
        >
          <WorkplaceIcon size={size} />
        </WorkplaceShareButton>
      </div>
    );
  } else if (name === "line") {
    return (
      <div className="Demo__some-network">
        <LineShareButton
          url={shareUrl}
          title={name}
          className="Demo__some-network__share-button"
        >
          <LineIcon size={size} />
        </LineShareButton>
      </div>
    );
  } else if (name === "weibo") {
    return (
      <div className="Demo__some-network">
        <WeiboShareButton
          url={shareUrl}
          title={name}
        //   image={`${String(window.location)}/${exampleImage}`}
          className="Demo__some-network__share-button"
        >
          <WeiboIcon size={size} />
        </WeiboShareButton>
      </div>
    );
  } else if (name === "pocket") {
    return (
      <div className="Demo__some-network">
        <PocketShareButton
          url={shareUrl}
          title={name}
          className="Demo__some-network__share-button"
        >
          <PocketIcon size={size} />
        </PocketShareButton>
      </div>
    );
  } else if (name === "instapaper") {
    return (
      <div className="Demo__some-network">
        <InstapaperShareButton
          url={shareUrl}
          title={name}
          className="Demo__some-network__share-button"
        >
          <InstapaperIcon size={size} />
        </InstapaperShareButton>
      </div>
    );
  } else if (name === "hatena") {
    return (
      <div className="Demo__some-network">
        <HatenaShareButton
          url={shareUrl}
          title={name}
          windowWidth={660}
          windowHeight={460}
          className="Demo__some-network__share-button"
        >
          <HatenaIcon size={size} />
        </HatenaShareButton>

        {/* <div>
          <HatenaShareCount
            url={shareUrl}
            className="Demo__some-network__share-count"
          />
        </div> */}
      </div>
    );
  }
};

const getFirstFourElements = (link:string) => {
  const allIcons = getAllIcons();
  const icons = allIcons.slice(0, 4);
  return icons.map((icon, i) => ({
    ...icon,
    id: i + 1,
    link: link,
    icon: getShareIcon(icon.name, link, 55),
  }));
};

const getRemainingElements = (link:string) => {
  const allIcons = getAllIcons(30);
  const icons = allIcons.slice(4, allIcons.length);
  return icons.map((icon, i) => ({
    ...icon,
    id: i + 4,
    link: link,
    icon: getShareIcon(icon.name, link, 30),
  }));
};


export const ShareIconComponent: FunctionalComponent<IProps> = ({
  children,
  alignIcons: align,
  link
}: IProps) => {
  const [items, setItems] = useState(getFirstFourElements(link) || []);
  const [dropdownItems, setDropdownItems] = useState(
    getRemainingElements(link) || []
  );

  const getAlignClass = () => {
    let alignClass = "";
    if (align === "left") {
      alignClass += "flex-col left-0 top-10";
    }
    if (align === "right") {
      alignClass += "flex-col right-0 top-10";
    }

    if (align === "top") {
      alignClass += "flex top-0 justify-center w-screen";
    }

    if (align === "bottom") {
      alignClass += "flex bottom-0 justify-center w-screen";
    }

    if (align === "top-left") {
      alignClass += "flex flex-row-reverse top-0 left-0";
    }

    if (align === "top-right") {
      alignClass += "flex top-0 right-0";
    }

    if (align === "bottom-left") {
      alignClass += "flex flex-row-reverse bottom-0 left-0";
    }

    if (align === "bottom-right") {
      alignClass += "flex bottom-0 right-0";
    }

    return alignClass;
  }
 
  return (
    <div class={`${"s-soft"} ${getAlignClass()}`} >
        {items.map((item, index) => (
          <div
            class={`${"s-item"} ${item.name} cursor-pointer ${align === 'left'? 'hover:pl-10': (align === "right"? "hover:pr-10" : "")}`}
            target="_blank"
          >
            {item.icon}
            
          </div>
        ))}
    

        <div  class={`relative inline-block ${"dropdown"}`}>
          <a
            class={`${"s-item"} cursor-pointer bg-green-600 `}
          >
            <span class="fa fa-ellipsis-h text-white"></span>
          </a>
            <div class={align.indexOf("bottom") !== -1  ? "dropup-content": "dropdown-content"}>
              <ul class="py-1">
                {dropdownItems.map((di, i) => (
                  <li>
                    <div
                      class={`flex cursor-pointer block py-0.5 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white`}
                      target="_blank"
                    >
                      {di.icon} 
                    </div>
                  </li>
                ))}
              </ul>
            </div>
        </div>
    </div>
  );
};
