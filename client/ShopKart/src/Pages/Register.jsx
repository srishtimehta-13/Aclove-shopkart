import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../axiosCalls/axios";
import { useAuth } from "../hooks/useAuth";

function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loader, setLoader] = useState(false);
  const [err, setErr] = useState();

  const navigate = useNavigate();
  const { setCustomer } = useAuth();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    setErr(null);

    try {
      const res = await axiosInstance.post("/customers/register", form);

      if (res.data?.customer) {
        setCustomer(res.data.customer);
      }
      setLoader(false);
      navigate("/home");
    } catch (error) {
      setLoader(false);
      setErr(error.response?.data?.message || error.message || "Registration failed");
    }
  };


  return (
    <div className="min-h-screen relative overflow-hidden bg-[#F7F1E6] text-[#292A2A] flex items-center justify-center px-5 py-10 sm:px-8">

      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

      {/* Sage glow */}
      <div
        className="
          absolute
          -top-40
          -left-40
          w-[430px]
          h-[430px]
          rounded-full
          bg-[#71977C]/15
          blur-3xl
          animate-pulse
          pointer-events-none
        "
      />

      {/* Gold glow */}
      <div
        className="
          absolute
          -bottom-48
          -right-40
          w-[500px]
          h-[500px]
          rounded-full
          bg-[#C89A55]/10
          blur-3xl
          animate-pulse
          pointer-events-none
        "
        style={{ animationDuration: "6s" }}
      />

      {/* Decorative arches */}

      <div
        className="
          absolute
          -top-[360px]
          left-1/2
          -translate-x-1/2
          w-[620px]
          h-[700px]
          rounded-[50%]
          border
          border-[#17483F]/10
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          -top-[330px]
          left-1/2
          -translate-x-1/2
          w-[530px]
          h-[620px]
          rounded-[50%]
          border
          border-[#C89A55]/10
          pointer-events-none
        "
      />

      {/* Floating sparkle */}

      <span
        className="
          absolute
          top-[15%]
          left-[8%]
          sm:left-[15%]
          text-[#C89A55]/50
          text-xl
          animate-bounce
          pointer-events-none
        "
        style={{ animationDuration: "3.5s" }}
      >
        ✦
      </span>

      <span
        className="
          absolute
          bottom-[15%]
          right-[8%]
          sm:right-[15%]
          text-[#17483F]/25
          text-2xl
          animate-bounce
          pointer-events-none
        "
        style={{ animationDuration: "4s" }}
      >
        ✦
      </span>

      {/* Decorative dots */}

      <span
        className="
          hidden sm:block
          absolute
          top-[35%]
          right-[18%]
          w-1.5
          h-1.5
          rounded-full
          bg-[#C89A55]/40
          animate-pulse
        "
      />

      <span
        className="
          hidden sm:block
          absolute
          bottom-[32%]
          left-[20%]
          w-1
          h-1
          rounded-full
          bg-[#71977C]/40
          animate-pulse
        "
      />

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-[450px]
          animate-[fadeIn_.8s_ease-out]
        "
      >

        {/* =====================================================
            LOGO
        ====================================================== */}

        <div
          className="
            flex
            justify-center
            mb-6
            animate-[logoReveal_1s_ease-out]
          "
        >
          <Link
            to="/"
            aria-label="ALCOVE home"
            className="font-serif text-5xl font-medium tracking-[0.16em] text-[#17483F] transition-transform duration-700 hover:-translate-y-1 hover:scale-[1.03] sm:text-6xl"
          >
            ALCOVE
          </Link>
        </div>

        {/* Decorative divider */}

        <div className="flex items-center justify-center gap-4 mb-7">

          <div
            className="
              w-14
              h-px
              bg-gradient-to-r
              from-transparent
              to-[#17483F]/25
            "
          />

          <span className="text-[#C89A55] text-xs animate-pulse">
            ✦
          </span>

          <div
            className="
              w-14
              h-px
              bg-gradient-to-l
              from-transparent
              to-[#17483F]/25
            "
          />

        </div>

        {/* =====================================================
            REGISTER CARD
        ====================================================== */}

        <div
          className="
            relative
            bg-[#FBF8F2]/90
            backdrop-blur-xl
            border
            border-[#17483F]/10
            rounded-[2rem]
            p-7
            sm:p-9
            shadow-[0_25px_70px_rgba(41,42,42,0.10)]
            transition-all
            duration-500
            hover:shadow-[0_30px_80px_rgba(23,72,63,0.14)]
          "
        >

          {/* Top accent */}

          <div
            className="
              absolute
              top-0
              left-1/2
              -translate-x-1/2
              w-16
              h-[2px]
              bg-[#17483F]
              rounded-full
            "
          />

          {/* =================================================
              HEADER
          ================================================== */}

          <div className="mb-8">

            <p
              className="
                text-[#C89A55]
                text-[10px]
                uppercase
                tracking-[0.28em]
                font-semibold
                mb-2
              "
            >
              Welcome to Alcove
            </p>

            <h2
              className="
                font-serif
                text-3xl
                sm:text-4xl
                leading-tight
                text-[#292A2A]
              "
            >
              Create your

              <span className="block text-[#17483F] italic">
                little corner.
              </span>
            </h2>

            <p
              className="
                mt-3
                text-sm
                leading-relaxed
                text-[#292A2A]/50
                max-w-sm
              "
            >
              Join Alcove and discover pieces thoughtfully curated for you.
            </p>

          </div>

          {/* =================================================
              ERROR
          ================================================== */}

          {err && (
            <div
              className="
                mb-6
                px-4
                py-3
                rounded-xl
                bg-[#C89B91]/10
                border
                border-[#C89B91]/30
                text-[#7D4542]
                text-sm
                flex
                items-start
                gap-3
                animate-[shake_.4s_ease-in-out]
              "
            >

              <span
                className="
                  flex
                  items-center
                  justify-center
                  shrink-0
                  w-5
                  h-5
                  rounded-full
                  border
                  border-[#7D4542]/40
                  text-xs
                "
              >
                !
              </span>

              <span className="leading-5">
                {err.response?.data?.message ||
                  err.message ||
                  "Something went wrong!"}
              </span>

            </div>
          )}

          {/* =================================================
              FORM
          ================================================== */}

          <form
            className="space-y-5"
            onSubmit={handleSubmit}
          >

            {/* FULL NAME */}

            <div className="group">

              <label
                className="
                  block
                  mb-2
                  text-[10px]
                  uppercase
                  tracking-[0.18em]
                  font-semibold
                  text-[#17483F]/70
                  transition-colors
                  duration-300
                  group-focus-within:text-[#17483F]
                "
              >
                Full Name
              </label>

              <div className="relative">

                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="
                    w-full
                    bg-transparent
                    border-0
                    border-b
                    border-[#292A2A]/15
                    px-1
                    py-3
                    text-sm
                    text-[#292A2A]
                    placeholder:text-[#292A2A]/25
                    outline-none
                    transition-all
                    duration-300
                    focus:border-[#17483F]
                  "
                />

                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    h-[2px]
                    w-0
                    bg-[#17483F]
                    transition-all
                    duration-500
                    group-focus-within:w-full
                  "
                />

              </div>

            </div>

            {/* EMAIL */}

            <div className="group">

              <label
                className="
                  block
                  mb-2
                  text-[10px]
                  uppercase
                  tracking-[0.18em]
                  font-semibold
                  text-[#17483F]/70
                  transition-colors
                  duration-300
                  group-focus-within:text-[#17483F]
                "
              >
                Email Address
              </label>

              <div className="relative">

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="
                    w-full
                    bg-transparent
                    border-0
                    border-b
                    border-[#292A2A]/15
                    px-1
                    py-3
                    text-sm
                    text-[#292A2A]
                    placeholder:text-[#292A2A]/25
                    outline-none
                    transition-all
                    duration-300
                    focus:border-[#17483F]
                  "
                />

                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    h-[2px]
                    w-0
                    bg-[#17483F]
                    transition-all
                    duration-500
                    group-focus-within:w-full
                  "
                />

              </div>

            </div>

            {/* PHONE */}

            <div className="group">

              <label
                className="
                  block
                  mb-2
                  text-[10px]
                  uppercase
                  tracking-[0.18em]
                  font-semibold
                  text-[#17483F]/70
                  transition-colors
                  duration-300
                  group-focus-within:text-[#17483F]
                "
              >
                Phone Number
              </label>

              <div className="relative">

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 98765 43210"
                  className="
                    w-full
                    bg-transparent
                    border-0
                    border-b
                    border-[#292A2A]/15
                    px-1
                    py-3
                    text-sm
                    text-[#292A2A]
                    placeholder:text-[#292A2A]/25
                    outline-none
                    transition-all
                    duration-300
                    focus:border-[#17483F]
                  "
                />

                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    h-[2px]
                    w-0
                    bg-[#17483F]
                    transition-all
                    duration-500
                    group-focus-within:w-full
                  "
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="group">

              <label
                className="
                  block
                  mb-2
                  text-[10px]
                  uppercase
                  tracking-[0.18em]
                  font-semibold
                  text-[#17483F]/70
                  transition-colors
                  duration-300
                  group-focus-within:text-[#17483F]
                "
              >
                Password
              </label>

              <div className="relative">

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="
                    w-full
                    bg-transparent
                    border-0
                    border-b
                    border-[#292A2A]/15
                    px-1
                    py-3
                    text-sm
                    text-[#292A2A]
                    placeholder:text-[#292A2A]/25
                    outline-none
                    transition-all
                    duration-300
                    focus:border-[#17483F]
                  "
                />

                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    h-[2px]
                    w-0
                    bg-[#17483F]
                    transition-all
                    duration-500
                    group-focus-within:w-full
                  "
                />

              </div>

            </div>

            {/* =================================================
                SUBMIT BUTTON
            ================================================== */}

            <div className="pt-2">

              <button
                type="submit"
                disabled={loader}
                className="
                  relative
                  overflow-hidden
                  w-full
                  py-4
                  px-5
                  rounded-xl
                  bg-[#17483F]
                  text-[#F7F1E6]
                  text-[11px]
                  uppercase
                  tracking-[0.2em]
                  font-semibold
                  shadow-[0_10px_25px_rgba(23,72,63,0.18)]
                  transition-all
                  duration-300
                  hover:bg-[#123D35]
                  hover:-translate-y-0.5
                  hover:shadow-[0_15px_35px_rgba(23,72,63,0.25)]
                  active:translate-y-0
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  disabled:hover:translate-y-0
                  group
                "
              >

                {/* Button shine */}

                <span
                  className="
                    absolute
                    inset-0
                    -translate-x-full
                    bg-gradient-to-r
                    from-transparent
                    via-white/10
                    to-transparent
                    group-hover:translate-x-full
                    transition-transform
                    duration-700
                  "
                />

                {loader ? (
                  <span
                    className="
                      relative
                      flex
                      items-center
                      justify-center
                      gap-3
                    "
                  >

                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >

                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                      />

                      <path
                        className="opacity-80"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />

                    </svg>

                    Creating your account...

                  </span>
                ) : (
                  <span
                    className="
                      relative
                      flex
                      items-center
                      justify-center
                      gap-3
                    "
                  >

                    Create My Alcove

                    <span
                      className="
                        text-[#C89A55]
                        text-base
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    >
                      →
                    </span>

                  </span>
                )}

              </button>

            </div>

          </form>

          {/* =================================================
              LOGIN
          ================================================== */}

          <div className="mt-8">

            <div className="flex items-center gap-3 mb-6">

              <div className="flex-1 h-px bg-[#292A2A]/10" />

              <span className="text-[#C89A55] text-xs">
                ✦
              </span>

              <div className="flex-1 h-px bg-[#292A2A]/10" />

            </div>

            <p
              className="
                text-center
                text-sm
                text-[#292A2A]/50
              "
            >
              Already have an account?

              <Link
                to="/login"
                className="
                  ml-2
                  text-[#17483F]
                  font-semibold
                  relative
                  after:absolute
                  after:left-0
                  after:-bottom-1
                  after:w-full
                  after:h-px
                  after:bg-[#17483F]/25
                  hover:after:bg-[#17483F]
                  transition-all
                "
              >
                Sign in
              </Link>

            </p>

          </div>

        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <div className="text-center mt-6">

          <p
            className="
              text-[9px]
              uppercase
              tracking-[0.3em]
              text-[#292A2A]/30
            "
          >
            ✦ Curated with intention ✦
          </p>

        </div>

      </div>

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(25px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes logoReveal {
          from {
            opacity: 0;
            transform: translateY(-15px) scale(0.96);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }

          20% {
            transform: translateX(-5px);
          }

          40% {
            transform: translateX(5px);
          }

          60% {
            transform: translateX(-4px);
          }

          80% {
            transform: translateX(3px);
          }
        }
      `}</style>

    </div>
  );
}

export default Register;