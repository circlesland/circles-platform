<script lang="ts">
  import Icon from "fa-svelte";
  import { faHeart, faPlay } from "@fortawesome/free-solid-svg-icons";

  let movies = [
    {
      data: {
        title: "Spring",
        description:
          "Spring is the story of a shepherd girl and her dog, who face ancient spirits in order to continue the cycle of life. This poetic and visually stunning short film was written and directed by Andy Goralczyk, inspired by his childhood in the mountains of Germany.",
        loves: 25,
        link: "https://www.youtube.com/watch?v=WhWc3b3KhnY&t=56s",
        image: "images/movies/spring.png",
      },
      design: {
        button: {
          label: "Claim Ownership Now",
        },
      },
    },
    {
      data: {
        title: "Agent 327: Operation Barbershop",
        description:
          "This three-minute teaser for a full-length animated feature is based on Dutch artist Martin Lodewijk's classic comics series Agent 327.",
        loves: 5,
        link: "https://www.youtube.com/watch?v=mN0zPOpADL4",
        image: "images/movies/agent327.png",
      },
      design: {
        button: {
          label: "Claim Ownership Now",
        },
      },
    },
    {
      data: {
        title: "Caminandes 1: Llama Drama",
        description:
          "Caminandes is a Creative Commons movie made by Pablo Vazquez, Beorn Leonard, and Francesco Siddi. Music and Sound by Jan Morgenstern.",
        loves: 15,
        link: "https://www.youtube.com/watch?v=JOhiWY7XmoY",
        image: "images/movies/caminandes1.png",
      },
      design: {
        button: {
          label: "Claim Ownership Now",
        },
      },
    },
    {
      data: {
        title: "Sci-Fi Short Film 'FTL' | DUST",
        description:
          "A lone astronaut testing the first faster-than-light spacecraft travels farther than he imagined possible.",
        loves: 12,
        link: "https://www.youtube.com/watch?v=t8LD0iUYv80",
        image: "images/movies/Sci-FiFTL.png",
      },
      design: {
        button: {
          label: "Claim Ownership Now",
        },
      },
    },
    {
      data: {
        title: "The visit - Animated short film (2010)",
        description:
          "A tragicomical story about an old woman, who, to the horror of her son, is cooking up a meal in the middle of the night for her long-deceased friends.",
        loves: 16,
        link: "https://www.youtube.com/watch?v=kjBswyWjE2w",
        image: "images/movies/derBesuch.png",
      },
      design: {
        button: {
          label: "Claim Ownership Now",
        },
      },
    },
    {
      data: {
        title: "Waking Up",
        description:
          "This is a scene/short film from the open source movie, Waking Up, shot in the woods outside Mariestad, Sweden. The film is in the making by several people from all around the world. ",
        loves: 22,
        link: "http://www.sandofilm.com/portfolio/waking-up/",
        image: "images/movies/wakingup.png",
      },
      design: {
        button: {
          label: "Claim Ownership Now",
        },
      },
    },
  ];
</script>

<div class="h-full overflow-y-scroll">
  <section
    class="flex flex-col items-center justify-center w-full font-sans text-center bg-cover h-96"
    style="background:url('https://source.unsplash.com/T2UCFiXtqY4') no-repeat center center; background-size: cover; width: 100%">
    <div
      class="flex flex-col items-center justify-center w-full text-center bg-cover opacity-50 h-96 bg-dark">
      <h3
        class="m-4 mx-auto text-4xl font-black leading-normal text-white uppercase md:m8 md:text-6xl font-title">
        infinite imagination
      </h3>
    </div>
  </section>

  <section class="w-full p-4 mx-auto md:p-8">
    <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {#each movies as item}
        <div
          class="flex flex-col overflow-hidden bg-white border hover:shadow-xl rounded-xl border-light-200">
          <a
            href={item.data.link}
            class="flex flex-col items-center justify-center w-full h-48 font-sans text-center bg-cover"
            style="background:url({item.data.image}) no-repeat center center; background-size: cover; width: 100%">
            <div
              class="flex flex-col items-center justify-center w-full h-48 text-center bg-cover opacity-60 bg-dark">
              <div class="flex items-center justify-center w-16 h-16 mt-8">
                <Icon icon={faPlay} class="text-xl text-white" />
              </div>
              <h3
                class="mx-auto mb-4 text-3xl font-black leading-normal text-white font-title">
                <div class="flex items-center">
                  <Icon icon={faHeart} />
                  <span class="ml-2">{item.data.loves}</span>
                </div>
              </h3>
            </div>
          </a>
          <div class="flex flex-col justify-between flex-1">
            <div class="flex flex-col justify-start flex-1 px-4 pt-4 bg-white">
              <p class="text-lg uppercase text-primary font-title">
                {item.data.title}
              </p>
              <p class="pt-2 text-sm text-light-500">{item.data.description}</p>
            </div>
            <a
              href="https://discord.gg/tqRSx8XnSW"
              class="flex items-center w-full p-4 space-x-4 ">
              <button
                class="w-full px-4 py-2 font-semibold text-blue-700 bg-transparent border-2 border-blue-500 rounded-xl hover:bg-blue-500 hover:text-white hover:border-transparent">
                {item.design.button.label}
              </button>
              <button
                class="px-4 py-2 font-semibold text-red-500 bg-transparent border-2 border-red-500 rounded-xl hover:bg-red-500 hover:text-white hover:border-transparent">
                <Icon icon={faHeart} />
              </button>
            </a>
          </div>
        </div>
      {/each}
    </div>
  </section>
</div>
